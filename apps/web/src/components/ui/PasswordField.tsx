import { InputHTMLAttributes, useState } from "react";

interface PasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  error?: string;
}

export function PasswordField({ label, error, className = "", id, ...props }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">
        {label}
      </label>
      <div
        className={`flex items-center rounded-2xl border bg-[#f6eee9] transition-all ${
          error
            ? "border-red-300 focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-100"
            : "border-warm-200 focus-within:border-[#ff7a5c] focus-within:ring-2 focus-within:ring-[#ff7a5c]/15"
        }`}
      >
        <input
          {...props}
          id={inputId}
          type={visible ? "text" : "password"}
          className={`min-w-0 flex-1 rounded-2xl bg-transparent px-4 py-3.5 text-sm text-gray-800 placeholder-gray-300 outline-none ${className}`}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="mr-1.5 inline-flex h-10 items-center rounded-xl px-3 text-xs font-semibold text-gray-500 transition-colors hover:bg-white/80 hover:text-gray-700"
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
