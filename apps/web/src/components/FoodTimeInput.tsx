// apps/web/src/components/FoodTimeInput.tsx
// Add this field to EditPetPage and AddPetPage forms
// Corresponds to the food_time column on the pets table (stored as TIME in UTC)

interface FoodTimeInputProps {
  value: string; // "HH:MM" or ""
  onChange: (value: string) => void;
}

export function FoodTimeInput({ value, onChange }: FoodTimeInputProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-[#221a16]">
        Daily feeding time
      </label>
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-[#f1e3da] bg-white px-4 py-3 text-sm text-[#221a16] outline-none focus:border-[#ff7a5c] focus:ring-2 focus:ring-[#ff7a5c]/20"
      />
      <p className="text-xs text-[#b28d80]">
        You'll get a push notification at this time every day.{" "}
        {!value && "Leave empty to skip food reminders."}
      </p>
    </div>
  );
}
