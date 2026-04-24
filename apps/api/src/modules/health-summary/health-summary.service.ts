// ============================================================
// FEATURE: Health Summary — Overdue & Upcoming Alerts
// ============================================================
// GET /api/v1/health-summary
//
// Returns a structured summary of what's overdue, due soon,
// and upcoming across all of the user's pets.
// Consumed by a dashboard widget — no extra DB tables needed.
// ============================================================

import { supabaseAdmin } from "../../lib/supabase";

// --- Types ---

export interface HealthAlert {
  petId: string;
  petName: string;
  type: "vaccination" | "medication";
  name: string;
  dueDate: string;       // YYYY-MM-DD
  status: "overdue" | "due_today" | "due_soon"; // due_soon = within 7 days
  daysUntilDue: number;  // negative = overdue
}

export interface HealthSummary {
  overdue: HealthAlert[];
  dueToday: HealthAlert[];
  dueSoon: HealthAlert[];   // next 7 days (excluding today)
  totalAlerts: number;
}

// Supabase join shapes — mirrors what the select() queries actually return
interface PetJoin {
  id: string;
  name: string;
  owner_id: string;
}

interface MedicationWithPet {
  id: string;
  name: string;
  end_date: string | null;
  pets: PetJoin;
}

interface VaccinationWithPet {
  id: string;
  vaccine_name: string;
  next_due_at: string | null;
  pets: PetJoin;
}

// --- Helpers ---

function daysBetween(from: Date, to: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((to.getTime() - from.getTime()) / msPerDay);
}

function classifyAlert(dueDate: string): HealthAlert["status"] | null {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  const days = daysBetween(today, due);

  if (days < 0) return "overdue";
  if (days === 0) return "due_today";
  if (days <= 7) return "due_soon";
  return null; // not relevant
}

// --- Service ---

export async function getHealthSummary(ownerId: string): Promise<HealthSummary> {
  // Fetch in parallel — two queries, no joins needed across tables
  const [medsResult, vacsResult] = await Promise.all([
    supabaseAdmin
      .from("medications")
      .select("id, name, end_date, pets!inner(id, name, owner_id)")
      .eq("pets.owner_id", ownerId)
      .eq("is_active", true)
      .not("end_date", "is", null) as unknown as Promise<{ data: MedicationWithPet[] | null; error: unknown }>,

    supabaseAdmin
      .from("vaccinations")
      .select("id, vaccine_name, next_due_at, pets!inner(id, name, owner_id)")
      .eq("pets.owner_id", ownerId)
      .not("next_due_at", "is", null) as unknown as Promise<{ data: VaccinationWithPet[] | null; error: unknown }>,
  ]);

  const alerts: HealthAlert[] = [];
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  // Process medications
  for (const med of (medsResult.data ?? [])) {
    const pet = med.pets;
    if (!pet || !med.end_date) continue;
    const status = classifyAlert(med.end_date);
    if (!status) continue;

    alerts.push({
      petId: pet.id,
      petName: pet.name,
      type: "medication",
      name: med.name,
      dueDate: med.end_date,
      status,
      daysUntilDue: daysBetween(today, new Date(med.end_date)),
    });
  }

  // Process vaccinations
  for (const vac of (vacsResult.data ?? [])) {
    const pet = vac.pets;
    if (!pet || !vac.next_due_at) continue;
    const status = classifyAlert(vac.next_due_at);
    if (!status) continue;

    alerts.push({
      petId: pet.id,
      petName: pet.name,
      type: "vaccination",
      name: vac.vaccine_name,
      dueDate: vac.next_due_at,
      status,
      daysUntilDue: daysBetween(today, new Date(vac.next_due_at)),
    });
  }

  // Sort by urgency within each bucket
  const sortByDays = (a: HealthAlert, b: HealthAlert) => a.daysUntilDue - b.daysUntilDue;

  const overdue = alerts.filter((a) => a.status === "overdue").sort(sortByDays);
  const dueToday = alerts.filter((a) => a.status === "due_today");
  const dueSoon = alerts.filter((a) => a.status === "due_soon").sort(sortByDays);

  return {
    overdue,
    dueToday,
    dueSoon,
    totalAlerts: alerts.length,
  };
}
