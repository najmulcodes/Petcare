import type { User } from "@supabase/supabase-js";

function getInitials(value: string): string {
  const parts = value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) return "W";
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

export function getUserDisplayName(user: User | null | undefined): string {
  const rawName =
    (user?.user_metadata?.name as string | undefined) ??
    (user?.user_metadata?.full_name as string | undefined) ??
    (user?.user_metadata?.user_name as string | undefined);

  if (rawName?.trim()) return rawName.trim();

  const emailName = user?.email?.split("@")[0]?.replace(/[._-]+/g, " ").trim();
  if (emailName) {
    return emailName.replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  return "Pet Parent";
}

export function getUserAvatarUrl(user: User | null | undefined): string | undefined {
  return (
    (user?.user_metadata?.avatar_url as string | undefined) ??
    (user?.user_metadata?.picture as string | undefined) ??
    undefined
  );
}

export function getNameInitials(name: string | null | undefined): string {
  return getInitials(name ?? "");
}
