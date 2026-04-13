import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export function Navbar() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(246,238,233,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(0,0,0,0.06)" : "1px solid transparent",
        boxShadow: scrolled ? "0 2px 16px rgba(0,0,0,0.05)" : "none",
      }}
    >
      <div className="mx-auto flex h-14 max-w-md items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-gray-800">
          <span className="text-xl">🐾</span>
          <span className="text-sm tracking-tight">Whisker Diary</span>
        </Link>

        <nav className="flex items-center gap-1">
          {!user ? (
            <>
              <Link
                to="/login"
                className="rounded-2xl px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/login"
                className="rounded-2xl px-4 py-1.5 text-sm font-semibold text-white transition-all hover:scale-[1.02]"
                style={{ background: "#ff7a5c" }}
              >
                Sign up
              </Link>
            </>
          ) : (
            <button
              onClick={signOut}
              className="rounded-2xl border border-warm-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-warm-50 transition-colors"
            >
              Sign out
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
