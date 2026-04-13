import { Request, Response, NextFunction } from "express";
import { supabaseAdmin } from "../lib/supabase";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ success: false, error: "Missing or malformed Authorization header" });
    return;
  }

  const token = authHeader.slice(7);
  const { data, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !data.user) {
    res.status(401).json({ success: false, error: "Invalid or expired token" });
    return;
  }

  req.user = data.user;
  next();
}
