import app from "./app";
import { env } from "./config/env";
import { verifyEmailConnection } from "./lib/email";
import { startNotificationJob } from "./jobs/notification.job";

async function main() {
  await verifyEmailConnection();
  startNotificationJob();

  const server = app.listen(env.PORT, () => {
    console.log(`✅ API running on port ${env.PORT} [${env.NODE_ENV}]`);
  });

  process.on("SIGTERM", () => {
    console.log("SIGTERM received. Shutting down gracefully...");
    server.close(() => {
      console.log("Server closed.");
      process.exit(0);
    });
  });

  process.on("unhandledRejection", (reason) => {
    console.error("Unhandled rejection:", reason);
    // DO NOT exit — log and continue
    // process.exit(1) was crashing the server on every cron error
  });
}

main();