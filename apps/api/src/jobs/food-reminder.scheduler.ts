import cron from "node-cron";
import { Queue } from "bullmq";
import { supabaseAdmin } from "../lib/supabase";
import type { FoodReminderJobData } from "./food-reminder.worker";
import { env } from "../config/env";

const foodReminderQueue = new Queue<FoodReminderJobData>("food-reminders", {
  connection: { url: env.REDIS_URL },
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: { count: 50 },
    removeOnFail: { count: 20 },
  },
});

// Returns current time as "HH:MM" in UTC
function currentTimeUTC(): string {
  const now = new Date();
  const hh = String(now.getUTCHours()).padStart(2, "0");
  const mm = String(now.getUTCMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

async function enqueueFoodReminders(): Promise<void> {
  const currentTime = currentTimeUTC();

  // Find all pets with food_time matching the current minute
  // food_time is stored as TIME in Postgres, filter by HH:MM prefix
  const { data: pets, error } = await supabaseAdmin
    .from("pets")
    .select("id, name, owner_id, food_time")
    .not("food_time", "is", null)
    .like("food_time", `${currentTime}%`); // matches "HH:MM:SS" stored as time

  if (error || !pets || pets.length === 0) return;

  for (const pet of pets) {
    // Get owner email
    const { data: userData } = await supabaseAdmin.auth.admin.getUserById(pet.owner_id);
    const ownerEmail = userData?.user?.email;
    if (!ownerEmail) continue;

    // Get all push subscriptions for this owner
    const { data: subs } = await supabaseAdmin
      .from("push_subscriptions")
      .select("endpoint, p256dh, auth_key")
      .eq("owner_id", pet.owner_id);

    await foodReminderQueue.add(
      `food:${pet.id}`,
      {
        ownerEmail,
        petName: pet.name,
        pushSubscriptions: subs ?? [],
      },
      {
        // Deduplicate within the same minute
        jobId: `food:${pet.id}:${currentTime}`,
      }
    );
  }
}

export function startFoodReminderScheduler(): void {
  // Runs every minute — checks if any pet's food_time matches now
  cron.schedule("* * * * *", async () => {
    try {
      await enqueueFoodReminders();
    } catch (err) {
      console.error("[food-scheduler] Error:", err);
    }
  });

  console.log("✅ Food reminder scheduler started (checks every minute)");
}
