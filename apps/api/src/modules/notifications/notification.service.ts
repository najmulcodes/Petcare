import { supabaseAdmin } from "../../lib/supabase";
import { sendReminderEmail } from "../../lib/email";

interface PetRow {
  id: string;
  name: string;
  owner_id: string;
}

interface UserRow {
  email: string;
}

interface MedicationRow {
  id: string;
  pet_id: string;
  name: string;
  end_date: string | null;
  is_active: boolean;
  pets: PetRow;
}

interface VaccinationRow {
  id: string;
  pet_id: string;
  vaccine_name: string;
  next_due_at: string | null;
  pets: PetRow;
}

// Returns today's date string in YYYY-MM-DD (UTC)
function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

// Returns tomorrow's date string in YYYY-MM-DD (UTC)
function tomorrowStr(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().split("T")[0];
}

async function getOwnerEmail(ownerId: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin.auth.admin.getUserById(ownerId);
  if (error || !data?.user?.email) return null;
  return data.user.email;
}

export async function sendMedicationReminders(): Promise<void> {
  const today = todayStr();
  const tomorrow = tomorrowStr();

  // Find active medications whose end_date is today or tomorrow (due soon)
  // Also include medications with no end date that are active (ongoing)
  const { data: medications, error } = await supabaseAdmin
    .from("medications")
    .select("id, pet_id, name, end_date, is_active, pets(id, name, owner_id)")
    .eq("is_active", true)
    .or(`end_date.eq.${today},end_date.eq.${tomorrow}`) as {
      data: MedicationRow[] | null;
      error: unknown;
    };

  if (error || !medications) return;

  for (const med of medications) {
    const pet = med.pets;
    if (!pet) continue;

    const ownerEmail = await getOwnerEmail(pet.owner_id);
    if (!ownerEmail) continue;

    try {
      await sendReminderEmail({
        to: ownerEmail,
        petName: pet.name,
        taskType: "medication",
        taskName: med.name,
        dueDate: med.end_date ?? today,
      });
      console.log(`[notifications] Medication reminder sent → ${ownerEmail} for ${pet.name} (${med.name})`);
    } catch (emailErr) {
      console.error(`[notifications] Failed to send medication reminder:`, emailErr);
    }
  }
}

export async function sendVaccinationReminders(): Promise<void> {
  const today = todayStr();
  const tomorrow = tomorrowStr();

  // Find vaccinations due today or tomorrow
  const { data: vaccinations, error } = await supabaseAdmin
    .from("vaccinations")
    .select("id, pet_id, vaccine_name, next_due_at, pets(id, name, owner_id)")
    .or(`next_due_at.eq.${today},next_due_at.eq.${tomorrow}`) as {
      data: VaccinationRow[] | null;
      error: unknown;
    };

  if (error || !vaccinations) return;

  for (const vac of vaccinations) {
    const pet = vac.pets;
    if (!pet || !vac.next_due_at) continue;

    const ownerEmail = await getOwnerEmail(pet.owner_id);
    if (!ownerEmail) continue;

    try {
      await sendReminderEmail({
        to: ownerEmail,
        petName: pet.name,
        taskType: "vaccination",
        taskName: vac.vaccine_name,
        dueDate: vac.next_due_at,
      });
      console.log(`[notifications] Vaccination reminder sent → ${ownerEmail} for ${pet.name} (${vac.vaccine_name})`);
    } catch (emailErr) {
      console.error(`[notifications] Failed to send vaccination reminder:`, emailErr);
    }
  }
}

export async function runAllReminders(): Promise<void> {
  console.log("[notifications] Running reminder check...");
  await Promise.allSettled([
    sendMedicationReminders(),
    sendVaccinationReminders(),
  ]);
  console.log("[notifications] Reminder check complete.");
}
