import { Router, Request, Response } from "express";
import { requireAuth } from "../../middleware/auth";

const router = Router();

router.get("/me", requireAuth, (req: Request, res: Response) => {
  const { id, email, created_at } = req.user;
  res.json({ success: true, data: { id, email, createdAt: created_at } });
});

export default router;
