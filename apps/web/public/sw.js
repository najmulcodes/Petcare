// apps/web/public/sw.js
// Service worker for Web Push notifications.
// Must be at the root of your domain — placing it in public/ handles this with Vite.

self.addEventListener("push", (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: "Whisker Diary", body: event.data.text() };
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: payload.icon ?? "/paw-icon.svg",
      badge: "/paw-icon.svg",
    })
  );
});

// When user taps the notification, focus the app window
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow("/dashboard");
    })
  );
});
