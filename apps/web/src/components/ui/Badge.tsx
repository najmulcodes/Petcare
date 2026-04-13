import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  color?: string;
  className?: string;
}

export function Badge({ children, color, className = "" }: BadgeProps) {
  const style = color ? { backgroundColor: `${color}20`, color } : undefined;
  return (
    <span
      style={style}
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        !color ? "bg-[#fff4f1] text-[#ff7a5c]" : ""
      } ${className}`}
    >
      {children}
    </span>
  );
}
