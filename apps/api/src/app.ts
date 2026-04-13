import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import apiRouter from "./routes/index";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (env.ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin '${origin}' not allowed`));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use("/api/v1", apiRouter);

app.use((_req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

app.use(errorHandler);

export default app;
