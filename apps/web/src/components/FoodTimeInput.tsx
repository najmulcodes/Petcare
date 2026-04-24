// apps/web/src/components/FoodTimeInput.tsx
//
// IMPORTANT — timezone handling:
// food_time is stored as UTC in the database. The scheduler matches
// against UTC time. This component converts the user's local input
// to UTC before passing it up, and displays the stored UTC value
// converted back to local time.

interface FoodTimeInputProps {
  /** UTC "HH:MM" string as stored in the DB, or "" if unset */
  value: string;
  onChange: (utcValue: string) => void;
}

/** Convert a UTC "HH:MM" string to local "HH:MM" for display */
function utcToLocal(utcTime: string): string {
  if (!utcTime) return "";
  const [hh, mm] = utcTime.split(":").map(Number);
  const date = new Date();
  date.setUTCHours(hh, mm, 0, 0);
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

/** Convert a local "HH:MM" string to UTC "HH:MM" for storage */
function localToUtc(localTime: string): string {
  if (!localTime) return "";
  const [hh, mm] = localTime.split(":").map(Number);
  const date = new Date();
  date.setHours(hh, mm, 0, 0);
  return `${String(date.getUTCHours()).padStart(2, "0")}:${String(date.getUTCMinutes()).padStart(2, "0")}`;
}

function getUtcOffsetLabel(): string {
  const offsetMin = -new Date().getTimezoneOffset();
  const sign = offsetMin >= 0 ? "+" : "-";
  const abs = Math.abs(offsetMin);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `UTC${sign}${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function FoodTimeInput({ value, onChange }: FoodTimeInputProps) {
  const localValue = utcToLocal(value);

  function handleChange(localTime: string) {
    onChange(localToUtc(localTime));
  }

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-[#221a16]">
        Daily feeding time
      </label>
      <input
        type="time"
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full rounded-2xl border border-[#f1e3da] bg-white px-4 py-3 text-sm text-[#221a16] outline-none focus:border-[#ff7a5c] focus:ring-2 focus:ring-[#ff7a5c]/20"
      />
      <p className="text-xs text-[#b28d80]">
        {localValue
          ? `Reminder fires at ${localValue} your local time (${getUtcOffsetLabel()}).`
          : "Leave empty to skip daily food reminders."}
      </p>
    </div>
  );
}
