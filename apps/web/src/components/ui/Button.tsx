import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: ReactNode;
}

const variantClasses: Record<string, string> = {
  primary: "text-white disabled:opacity-50",
  secondary: "border border-warm-200 bg-[#f6eee9] text-gray-700 hover:bg-warm-100",
  danger: "bg-red-50 text-red-500 hover:bg-red-100",
  ghost: "bg-transparent text-gray-600 hover:bg-[#f6eee9]",
};

const variantStyles: Record<string, React.CSSProperties> = {
  primary: { background: "#ff7a5c", boxShadow: "0 4px 16px rgba(255,122,92,0.3)" },
  secondary: {},
  danger: {},
  ghost: {},
};

const sizeClasses: Record<string, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  className = "",
  style,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed focus:outline-none ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      style={{ ...variantStyles[variant], ...style }}
      {...props}
    >
      {loading && (
        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
