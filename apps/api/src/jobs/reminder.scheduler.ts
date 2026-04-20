import cron from "node-cron";
import { enqueueAllReminders } from "../modules/notifications/notification.service";

// node-cron is kept only as a scheduler trigger.
// The actual email work happens in the BullMQ worker, with retry logic.
// This function's only job is to call the enqueuer on a schedule.
export function startReminderScheduler(): void {
  // Runs at 8:00 AM UTC daily — adjust to your users' timezone needs
  cron.schedule("0 8 * * *", async () => {
    try {
      await enqueueAllReminders();
    } catch (err) {
      // Enqueuer errors are non-fatal — the next run will catch anything missed
      console.error("[scheduler] Failed to enqueue reminders:", err);
    }
  });

  console.log("✅ Reminder scheduler started (runs daily at 08:00 UTC)");
}
