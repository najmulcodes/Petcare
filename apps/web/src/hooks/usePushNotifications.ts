// apps/web/src/hooks/usePushNotifications.ts

import { useState, useEffect } from "react";
import { api } from "../lib/api";

async function getVapidPublicKey(): Promise<string> {
  const res = await api.get("/push/vapid-public-key");
  return res.data.data.publicKey;
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsSupported("serviceWorker" in navigator && "PushManager" in window);

    // Check if already subscribed
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((sub) => {
          setIsSubscribed(!!sub);
        });
      });
    }
  }, []);

  async function subscribe(): Promise<void> {
    setIsLoading(true);
    setError(null);

    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setError("Notification permission denied. Enable it in your browser settings.");
        return;
      }

      const vapidKey = await getVapidPublicKey();
      const reg = await navigator.serviceWorker.ready;
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey).buffer as ArrayBuffer,
      });

      const json = subscription.toJSON();
      await api.post("/push/subscribe", {
        endpoint: json.endpoint,
        keys: { p256dh: json.keys?.p256dh, auth: json.keys?.auth },
      });

      setIsSubscribed(true);
    } catch (err: any) {
      setError(err.message ?? "Failed to enable push notifications");
    } finally {
      setIsLoading(false);
    }
  }

  async function unsubscribe(): Promise<void> {
    setIsLoading(true);
    setError(null);

    try {
      const reg = await navigator.serviceWorker.ready;
      const subscription = await reg.pushManager.getSubscription();
      if (!subscription) return;

      await api.delete("/push/unsubscribe", {
        data: { endpoint: subscription.endpoint },
      });
      await subscription.unsubscribe();

      setIsSubscribed(false);
    } catch (err: any) {
      setError(err.message ?? "Failed to disable push notifications");
    } finally {
      setIsLoading(false);
    }
  }

  return { isSupported, isSubscribed, isLoading, error, subscribe, unsubscribe };
}
