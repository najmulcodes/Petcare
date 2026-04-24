import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ success: false, error: err.message });
    return;
  }

  // CORS rejections come through as plain Errors from the cors() callback
  if (err instanceof Error && err.message.includes("not allowed by CORS")) {
    res.status(403).json({ success: false, error: "Forbidden: CORS policy" });
    return;
  }

  console.error("Unhandled error:", err);

  res.status(500).json({
    success: false,
    error:
      env.NODE_ENV === "production"
        ? "Internal server error"
        : err instanceof Error
          ? err.message
          : "Unknown error",
  });
}
