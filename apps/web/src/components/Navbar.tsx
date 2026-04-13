import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export function Navbar() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const isHomePage = location.pathname === "/";

  return (
    <header
      className="sticky top-0 z-30 transition-all duration-300"
      style={{
        background: scrolled
          ? isHomePage
            ? "rgba(10,10,15,0.85)"
            : "rgba(255,255,255,0.92)"
          : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled
          ? isHomePage
            ? "1px solid rgba(255,255,255,0.06)"
            : "1px solid rgba(0,0,0,0.08)"
          : "1px solid transparent",
      }}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold"
          style={{ color: isHomePage ? "rgba(255,255,255,0.9)" : "#5b21b6" }}
        >
          <span className="text-xl">🐾</span>
          <span className="hidden text-sm tracking-tight sm:inline">
            Whisker Diary
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {!user ? (
            <>
              <Link
                to="/"
                className="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
                style={{
                  color: isHomePage ? "rgba(255,255,255,0.45)" : "#6b7280",
                }}
              >
                Home
              </Link>
              <Link
                to="/login"
                className="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
                style={{
                  color: isHomePage ? "rgba(255,255,255,0.45)" : "#6b7280",
                }}
              >
                Login
              </Link>
              <Link
                to="/login"
                className="ml-1 rounded-lg px-4 py-1.5 text-sm font-semibold text-white transition-all hover:scale-[1.02]"
                style={{
                  background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
                  boxShadow: "0 0 0 1px rgba(124,58,237,0.4)",
                }}
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
                style={{
                  color: isHomePage ? "rgba(255,255,255,0.75)" : "#4b5563",
                }}
              >
                Dashboard
              </Link>
              <Link
                to="/pets"
                className="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
                style={{
                  color: isHomePage ? "rgba(255,255,255,0.75)" : "#4b5563",
                }}
              >
                Pets
              </Link>
              <Link
                to="/expenses"
                className="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
                style={{
                  color: isHomePage ? "rgba(255,255,255,0.75)" : "#4b5563",
                }}
              >
                Expenses
              </Link>
              <button
                onClick={signOut}
                className="ml-1 rounded-lg px-4 py-1.5 text-sm font-semibold text-white transition-all hover:scale-[1.02]"
                style={{
                  background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
                  boxShadow: "0 0 0 1px rgba(124,58,237,0.4)",
                }}
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}