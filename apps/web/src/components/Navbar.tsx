import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { EntityAvatar } from "./ui/EntityAvatar";
import { getUserAvatarUrl, getUserDisplayName } from "../lib/user";

export function Navbar() {
  const { user, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const avatarUrl = getUserAvatarUrl(user);
  const displayName = getUserDisplayName(user);
  const appLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/pets", label: "Pets" },
    { to: "/expenses", label: "Expenses" },
  ];

  return (
    <header
      className="fixed left-0 top-0 z-50 w-full transition-all duration-300"
      style={{
        background: scrolled ? "rgba(255, 248, 244, 0.82)" : "transparent",
        backdropFilter: scrolled ? "blur(18px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(126, 109, 102, 0.12)" : "1px solid transparent",
        boxShadow: scrolled ? "0 10px 32px rgba(34, 26, 22, 0.06)" : "none",
      }}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 xl:px-10">
        <Link to={user ? "/dashboard" : "/"} className="flex min-w-0 items-center gap-3 text-gray-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/70 bg-white/85 shadow-soft">
            <span className="font-display text-lg text-[#ff7a5c]">W</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#b28d80]">Whisker Diary</p>
            <p className="truncate text-sm font-semibold text-[#221a16]">Pet care, expenses, and reminders</p>
          </div>
        </Link>

        <nav className="flex items-center gap-2 md:gap-3">
          {!user ? (
            <>
              <Link
                to="/login"
                className="hidden rounded-2xl px-4 py-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-800 sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                to="/login"
                className="inline-flex rounded-2xl px-4 py-2 text-sm font-semibold text-white transition-all hover:scale-[1.02]"
                style={{ background: "#ff7a5c", boxShadow: "0 10px 22px rgba(255, 122, 92, 0.24)" }}
              >
                Get started
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="hidden items-center gap-1 rounded-full border border-white/70 bg-white/80 p-1 shadow-soft md:flex">
                {appLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
                        isActive ? "bg-[#fff4f1] text-[#ff7a5c]" : "text-gray-500 hover:text-gray-800"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-2xl px-1.5 py-1 transition-colors hover:bg-white/60"
              >
                <EntityAvatar
                  src={avatarUrl}
                  name={displayName}
                  kind="user"
                  className="h-10 w-10 rounded-2xl border border-white/70"
                  textClassName="text-sm"
                />
                <div className="hidden min-w-0 md:block">
                  <p className="max-w-[10rem] truncate text-sm font-semibold text-[#221a16]">{displayName}</p>
                  <p className="text-xs text-[#8c776f]">Profile</p>
                </div>
              </Link>
              <button
                onClick={signOut}
                className="hidden rounded-2xl border border-warm-200 bg-white/85 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-white lg:inline-flex"
              >
                Sign out
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
