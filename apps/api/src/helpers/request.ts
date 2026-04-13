import { Request } from "express";

export function getUserId(req: Request): string {
  return req.user.id;
}
