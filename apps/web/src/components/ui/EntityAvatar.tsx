import { useEffect, useState } from "react";
import { getNameInitials } from "../../lib/user";

interface EntityAvatarProps {
  src?: string | null;
  name?: string | null;
  kind?: "user" | "pet";
  className?: string;
  imageClassName?: string;
  textClassName?: string;
}

export function EntityAvatar({
  src,
  name,
  kind = "user",
  className = "",
  imageClassName = "",
  textClassName = "",
}: EntityAvatarProps) {
  const [broken, setBroken] = useState(false);
  const initials = getNameInitials(name);
  const fallbackTone =
    kind === "pet"
      ? "from-[#ffdcca] via-[#fff1e9] to-[#f6d8c9] text-[#9d5c48]"
      : "from-[#ffd8cc] via-[#fff6f2] to-[#f1ddd3] text-[#8d5b4d]";

  useEffect(() => {
    setBroken(false);
  }, [src]);

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${fallbackTone} ${className}`}
    >
      {src && !broken ? (
        <img
          src={src}
          alt={name ?? kind}
          className={`h-full w-full object-cover ${imageClassName}`}
          onError={() => setBroken(true)}
        />
      ) : (
        <div className={`flex h-full w-full items-center justify-center font-semibold ${textClassName}`}>
          {initials}
        </div>
      )}
    </div>
  );
}
