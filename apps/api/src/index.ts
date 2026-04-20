import app from "./app";
import { env } from "./config/env";
import { verifyEmailConnection } from "./lib/email";
import { startReminderScheduler } from "./jobs/reminder.scheduler";
import { startReminderWorker } from "./jobs/reminder.worker";
import { startFoodReminderScheduler } from "./jobs/food-reminder.scheduler";
import { startFoodReminderWorker } from "./jobs/food-reminder.worker";

async function main() {
  await verifyEmailConnection();

  const reminderWorker = startReminderWorker();
  const foodWorker = startFoodReminderWorker();

  startReminderScheduler();
  startFoodReminderScheduler();

  const server = app.listen(env.PORT, () => {
    console.log(`✅ API running on port ${env.PORT} [${env.NODE_ENV}]`);
  });

  async function shutdown(signal: string) {
    console.log(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await Promise.all([reminderWorker.close(), foodWorker.close()]);
      console.log("Server and workers closed.");
      process.exit(0);
    });
  }

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  process.on("unhandledRejection", (reason) => {
    console.error("Unhandled rejection:", reason);
  });
}

main();
