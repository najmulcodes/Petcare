import cron from "node-cron";
import { runAllReminders } from "../modules/notifications/notification.service";

// Runs at the top of every hour: "0 * * * *"
// In development you can change to "* * * * *" to test every minute
export function startNotificationJob(): void {
  const schedule = process.env.NODE_ENV === "development" ? "0 * * * *" : "0 * * * *";

  cron.schedule(schedule, async () => {
    try {
      await runAllReminders();
    } catch (err) {
      console.error("[cron] Unhandled error in notification job:", err);
    }
  });

  console.log("✅ Notification cron job started (runs hourly)");
}
