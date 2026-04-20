// apps/web/src/components/NotificationSettings.tsx
// Drop this inside ProfilePage.tsx as a new <Section>

import { usePushNotifications } from "../hooks/usePushNotifications";

export function NotificationSettings() {
  const { isSupported, isSubscribed, isLoading, error, subscribe, unsubscribe } =
    usePushNotifications();

  if (!isSupported) {
    return (
      <p className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
        Push notifications are not supported in this browser.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-[24px] border border-[#f1e3da] bg-[#fffaf7] px-4 py-4">
        <div>
          <p className="text-sm font-semibold text-[#221a16]">Push notifications</p>
          <p className="mt-1 text-sm text-[#7e6d66]">
            {isSubscribed
              ? "You'll receive reminders on this device."
              : "Get feeding times and health reminders on this device."}
          </p>
        </div>

        <button
          onClick={isSubscribed ? unsubscribe : subscribe}
          disabled={isLoading}
          className={`ml-4 shrink-0 rounded-2xl px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50 ${
            isSubscribed
              ? "border border-[#f1e3da] bg-white text-[#7e6d66] hover:bg-[#fff8f4]"
              : "text-white"
          }`}
          style={!isSubscribed ? { background: "#ff7a5c" } : undefined}
        >
          {isLoading ? "..." : isSubscribed ? "Disable" : "Enable"}
        </button>
      </div>

      {error && (
        <p className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
