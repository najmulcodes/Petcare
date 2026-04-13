import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { setAccessToken } from "../lib/api";
import { useNavigate } from "react-router-dom";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔹 Initial session load (important for refresh + OAuth return)
    supabase.auth.getSession().then(({ data }) => {
      const s = data.session ?? null;

      setSession(s);
      setUser(s?.user ?? null);
      setAccessToken(s?.access_token ?? null);
      setLoading(false);

      // ✅ Redirect after OAuth / refresh
      if (s?.user && window.location.pathname === "/login") {
        navigate("/dashboard", { replace: true });
      }
    });

    // 🔹 Listen to auth changes (login, logout, refresh)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, s) => {
        setSession(s);
        setUser(s?.user ?? null);
        setAccessToken(s?.access_token ?? null);
        setLoading(false);

        // ✅ Redirect after login (especially Google OAuth)
        if (s?.user) {
          navigate("/dashboard", { replace: true });
        }

        // ✅ Redirect after logout
        if (!s?.user) {
          navigate("/login", { replace: true });
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [navigate]);

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}