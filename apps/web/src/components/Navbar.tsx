import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export function Navbar() {
  const { user, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const isOnDarkPage = !user;

  return (
    <header
      className="sticky top-0 z-30 transition-all duration-300"
      style={{
        background: scrolled
          ? isOnDarkPage
            ? "rgba(10,10,15,0.85)"
            : "rgba(255,255,255,0.92)"
          : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
      }}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold">
          🐾 Whisker Diary
        </Link>

        {!user ? (
          <Link to="/login">Login</Link>
        ) : (
          <button onClick={signOut}>Logout</button>
        )}
      </div>
    </header>
  );
}