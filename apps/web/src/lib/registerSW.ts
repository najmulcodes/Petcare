// apps/web/src/lib/registerSW.ts
// Call registerServiceWorker() once in main.tsx

export async function registerServiceWorker(): Promise<void> {
  if (!("serviceWorker" in navigator)) return;

  try {
    await navigator.serviceWorker.register("/sw.js");
    console.log("[sw] Service worker registered");
  } catch (err) {
    console.warn("[sw] Service worker registration failed:", err);
  }
}
