import { Queue } from "bullmq";
import { env } from "../config/env";

// Single queue for all reminder types.
// Job data is typed — no stringly-typed payloads floating around.
export interface ReminderJobData {
  type: "medication" | "vaccination";
  ownerEmail: string;
  petName: string;
  taskName: string;
  dueDate: string; // YYYY-MM-DD
}

export const reminderQueue = new Queue<ReminderJobData>("reminders", {
  connection: { url: env.REDIS_URL },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000, // 5s → 25s → 125s
    },
    removeOnComplete: { count: 100 }, // keep last 100 completed jobs for inspection
    removeOnFail: { count: 50 },
  },
});
