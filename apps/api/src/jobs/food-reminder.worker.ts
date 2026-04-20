import { Worker } from "bullmq";
import { env } from "../config/env";
import { sendPushNotification } from "../lib/push";
import { sendReminderEmail } from "../lib/email";

export interface FoodReminderJobData {
  ownerEmail: string;
  petName: string;
  // All push subscriptions for this owner — send to all devices
  pushSubscriptions: Array<{
    endpoint: string;
    p256dh: string;
    auth_key: string;
  }>;
}

export function startFoodReminderWorker(): Worker {
  const worker = new Worker<FoodReminderJobData>(
    "food-reminders",
    async (job) => {
      const { ownerEmail, petName, pushSubscriptions } = job.data;

      const payload = {
        title: "🍽️ Feeding Time",
        body: `Time to feed ${petName}!`,
        icon: "/paw-icon.svg",
      };

      // Send push to all of the user's subscribed devices
      const pushResults = await Promise.allSettled(
        pushSubscriptions.map((sub) => sendPushNotification(sub, payload))
      );

      // Log any push failures — stale subscriptions (410 Gone) should ideally be cleaned up
      // For now just log; adding cleanup is a future improvement
      pushResults.forEach((result, i) => {
        if (result.status === "rejected") {
          console.warn(`[food-worker] Push failed for ${petName} (sub ${i}):`, result.reason?.message);
        }
      });

      // Also send email as fallback if no push subscriptions exist
      if (pushSubscriptions.length === 0) {
        await sendReminderEmail({
          to: ownerEmail,
          petName,
          taskType: "medication", // reusing existing type — close enough for email template
          taskName: "Feeding Time",
          dueDate: new Date().toISOString().split("T")[0],
        });
      }

      console.log(`[food-worker] Food reminder sent for ${petName}`);
    },
    {
      connection: { url: env.REDIS_URL },
      concurrency: 5,
    }
  );

  worker.on("failed", (job, err) => {
    console.error(`[food-worker] Job ${job?.id} failed:`, err.message);
  });

  worker.on("error", (err) => {
    console.error("[food-worker] Worker error:", err.message);
  });

  console.log("✅ Food reminder worker started");
  return worker;
}
