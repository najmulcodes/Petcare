import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full rounded-2xl border bg-[#f6eee9] px-4 py-3 text-sm text-gray-800 placeholder-gray-300 shadow-none transition-all focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
            error
              ? "border-red-300 focus:border-red-400 focus:ring-red-100"
              : "border-warm-200 focus:border-[#ff7a5c] focus:ring-[#ff7a5c]/15"
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
