import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { supabaseAdmin } from "../../lib/supabase";
import { env } from "../../config/env";

const router = Router();
router.use(requireAuth);

// GET /api/v1/push/vapid-public-key
// Frontend needs this to create a PushSubscription
router.get("/vapid-public-key", (_req, res) => {
  res.json({ success: true, data: { publicKey: env.VAPID_PUBLIC_KEY } });
});

// POST /api/v1/push/subscribe
// Body: { endpoint, keys: { p256dh, auth } }
router.post("/subscribe", async (req, res, next) => {
  try {
    const { endpoint, keys } = req.body as {
      endpoint: string;
      keys: { p256dh: string; auth: string };
    };

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      res.status(400).json({ success: false, error: "Invalid subscription object" });
      return;
    }

    // Upsert — if the user re-subscribes (e.g. after clearing browser data), update the keys
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
// Body: { endpoint }
router.delete("/unsubscribe", async (req, res, next) => {
  try {
    const { endpoint } = req.body as { endpoint: string };

    if (!endpoint) {
      res.status(400).json({ success: false, error: "endpoint is required" });
      return;
    }

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
