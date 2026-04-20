import webpush from "web-push";
import { env } from "../config/env";

// web-push uses VAPID keys to authenticate your server with browser push services.
// Generate once with: npx web-push generate-vapid-keys
// Then add VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY to your .env

webpush.setVapidDetails(
  `mailto:${env.VAPID_CONTACT_EMAIL}`,
  env.VAPID_PUBLIC_KEY,
  env.VAPID_PRIVATE_KEY
);

export interface PushPayload {
  title: string;
  body: string;
  icon?: string; // optional: "/paw-icon.png"
}

export interface PushSubscriptionKeys {
  endpoint: string;
  p256dh: string;
  auth_key: string;
}

export async function sendPushNotification(
  subscription: PushSubscriptionKeys,
  payload: PushPayload
): Promise<void> {
  await webpush.sendNotification(
    {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.p256dh,
        auth: subscription.auth_key,
      },
    },
    JSON.stringify(payload)
  );
}
