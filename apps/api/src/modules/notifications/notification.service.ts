import { supabaseAdmin } from "../../lib/supabase";
import { reminderQueue } from "../../jobs/reminder.queue";

// --- Types (mirrors your existing interfaces) ---

interface PetRow {
  id: string;
  name: string;
  owner_id: string;
}

interface MedicationRow {
  id: string;
  name: string;
  end_date: string | null;
  pets: PetRow;
}

interface VaccinationRow {
  id: string;
  vaccine_name: string;
  next_due_at: string | null;
  pets: PetRow;
}

// --- Helpers ---

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

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

// --- Job enqueuers (replace direct sendReminderEmail calls) ---

async function enqueueMedicationReminders(): Promise<void> {
  const today = todayStr();
  const tomorrow = tomorrowStr();

  const { data: medications, error } = await supabaseAdmin
    .from("medications")
    .select("id, name, end_date, pets(id, name, owner_id)")
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

    // Enqueue instead of sending inline.
    // BullMQ handles retries — this function just produces jobs.
    await reminderQueue.add(
      `medication:${med.id}`,
      {
        type: "medication",
        ownerEmail,
        petName: pet.name,
        taskName: med.name,
        dueDate: med.end_date ?? today,
      },
      {
        // Deduplicate: if a job with this name already exists in the queue,
        // BullMQ won't add it again. Prevents duplicate emails on cron overlap.
        jobId: `medication:${med.id}:${today}`,
      }
    );
  }
}

async function enqueueVaccinationReminders(): Promise<void> {
  const today = todayStr();
  const tomorrow = tomorrowStr();

  const { data: vaccinations, error } = await supabaseAdmin
    .from("vaccinations")
    .select("id, vaccine_name, next_due_at, pets(id, name, owner_id)")
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

    await reminderQueue.add(
      `vaccination:${vac.id}`,
      {
        type: "vaccination",
        ownerEmail,
        petName: pet.name,
        taskName: vac.vaccine_name,
        dueDate: vac.next_due_at,
      },
      {
        jobId: `vaccination:${vac.id}:${today}`,
      }
    );
  }
}

// Called by the scheduled job (replaces runAllReminders from cron version)
export async function enqueueAllReminders(): Promise<void> {
  console.log("[notifications] Enqueueing reminders...");
  await Promise.allSettled([
    enqueueMedicationReminders(),
    enqueueVaccinationReminders(),
  ]);
  console.log("[notifications] Done enqueueing.");
}