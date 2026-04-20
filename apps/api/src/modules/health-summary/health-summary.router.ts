import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { getHealthSummary } from "./health-summary.service";

const router = Router();

// GET /api/v1/health-summary
// Returns overdue, due-today, and due-soon alerts across all pets for the authed user.
// No query params needed — scope is always the current user.
router.get("/", requireAuth, async (req, res, next) => {
  try {
    const summary = await getHealthSummary(req.user.id);
    res.json({ success: true, data: summary });
  } catch (err) {
    next(err);
  }
});

export default router;