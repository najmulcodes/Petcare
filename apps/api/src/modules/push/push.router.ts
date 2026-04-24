import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../../middleware/auth";
import { validateBody } from "../../middleware/validate";
import { supabaseAdmin } from "../../lib/supabase";
import { env } from "../../config/env";

const router = Router();
router.use(requireAuth);

const subscribeSchema = z.object({
  endpoint: z.string().url("endpoint must be a valid URL"),
  keys: z.object({
    p256dh: z.string().min(1, "p256dh is required"),
    auth: z.string().min(1, "auth is required"),
  }),
});

const unsubscribeSchema = z.object({
  endpoint: z.string().url("endpoint must be a valid URL"),
});

// GET /api/v1/push/vapid-public-key
router.get("/vapid-public-key", (_req, res) => {
  if (!env.VAPID_PUBLIC_KEY) {
    res.status(503).json({ success: false, error: "Push notifications are not configured" });
    return;
  }
  res.json({ success: true, data: { publicKey: env.VAPID_PUBLIC_KEY } });
});

// POST /api/v1/push/subscribe
router.post("/subscribe", validateBody(subscribeSchema), async (req, res, next) => {
  try {
    if (!env.VAPID_PUBLIC_KEY) {
      res.status(503).json({ success: false, error: "Push notifications are not configured" });
      return;
    }

    const { endpoint, keys } = req.body as z.infer<typeof subscribeSchema>;

    const { error } = await supabaseAdmin.from("push_subscriptions").upsert(
      {
        owner_id: req.user.id,
        endpoint,
        p256dh: keys.p256dh,
        auth_key: keys.auth,
      },
      { onConflict: "endpoint" }
    );

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/push/unsubscribe
router.delete("/unsubscribe", validateBody(unsubscribeSchema), async (req, res, next) => {
  try {
    const { endpoint } = req.body as z.infer<typeof unsubscribeSchema>;

    await supabaseAdmin
      .from("push_subscriptions")
      .delete()
      .eq("owner_id", req.user.id)
      .eq("endpoint", endpoint);

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
