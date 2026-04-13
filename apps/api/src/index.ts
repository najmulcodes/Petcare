import app from "./app";
import { env } from "./config/env";
import { verifyEmailConnection } from "./lib/email";
import { startNotificationJob } from "./jobs/notification.job";

async function main() {
  await verifyEmailConnection();
  startNotificationJob();

  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
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
    process.exit(1);
  });
}

main();
