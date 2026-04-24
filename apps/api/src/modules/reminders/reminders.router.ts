import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { supabaseAdmin } from "../../lib/supabase";
import { AppError } from "../../middleware/errorHandler";

const router = Router();
router.use(requireAuth);

// GET /api/v1/reminders
// Returns active reminders for the authenticated user
router.get("/", async (req, res, next) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("reminders")
      .select("*")
      .eq("owner_id", req.user.id)
      .eq("is_active", true)
      .order("scheduled_for", { ascending: true });

    if (error) throw new AppError(500, error.message);

    res.json({ success: true, data: data ?? [] });
  } catch (err) {
    next(err);
  }
});

export default router;
