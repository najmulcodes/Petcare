import app from "./app";
import { env } from "./config/env";
import { verifyEmailConnection } from "./lib/email";
import { startReminderScheduler } from "./jobs/reminder.scheduler";
import { startReminderWorker } from "./jobs/reminder.worker";

async function main() {
  await verifyEmailConnection();

  const worker = startReminderWorker();
  startReminderScheduler();

  const server = app.listen(env.PORT, () => {
    console.log(`✅ API running on port ${env.PORT} [${env.NODE_ENV}]`);
  });

  // Graceful shutdown: close HTTP server, then drain the worker
  async function shutdown(signal: string) {
    console.log(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await worker.close();
      console.log("Server and worker closed.");
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
