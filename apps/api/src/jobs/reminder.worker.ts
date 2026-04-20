import { Worker } from "bullmq";
import { env } from "../config/env";
import { sendReminderEmail } from "../lib/email";
import type { ReminderJobData } from "./reminder.queue";

// The worker runs in the same process as Express.
// For a project at this scale, that's fine — no need for a separate worker service.
export function startReminderWorker(): Worker {
  const worker = new Worker<ReminderJobData>(
    "reminders",
    async (job) => {
      const { type, ownerEmail, petName, taskName, dueDate } = job.data;

      await sendReminderEmail({ to: ownerEmail, petName, taskType: type, taskName, dueDate });

      console.log(`[worker] Sent ${type} reminder → ${ownerEmail} for ${petName} (${taskName})`);
    },
    {
      connection: { url: env.REDIS_URL },
      concurrency: 5, // process up to 5 emails concurrently
    }
  );

  worker.on("failed", (job, err) => {
    console.error(`[worker] Job ${job?.id} failed (attempt ${job?.attemptsMade}):`, err.message);
  });

  worker.on("error", (err) => {
    // Connection errors — log and let BullMQ handle reconnection
    console.error("[worker] Worker error:", err.message);
  });

  console.log("✅ Reminder worker started");
  return worker;
}
