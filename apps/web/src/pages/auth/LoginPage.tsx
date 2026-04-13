import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { InlineError } from "../../components/ui/ErrorState";
import { requestNotificationPermission, notify } from "../../lib/notifications";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: authError } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (authError) { setError(authError.message); return; }

    await requestNotificationPermission();
    notify("Welcome to Whisker Diary 🐾", "You're all set. Track your pets and expenses!");
    navigate("/dashboard");
  }

  async function handleGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + "/dashboard" },
    });
    if (error) setError(error.message);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f6eee9] px-4">
      {/* Back to Home */}
      <Link
        to="/"
        className="absolute top-5 left-5 inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
      >
        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
          <path fillRule="evenodd" d="M9.78 12.78a.75.75 0 01-1.06 0L4.47 8.53a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 1.06L6.06 8l3.72 3.72a.75.75 0 010 1.06z" />
        </svg>
        Back
      </Link>

      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mb-3 text-5xl">🐾</div>
          <h1 className="text-2xl font-bold text-gray-900">Whisker Diary</h1>
          <p className="mt-1 text-sm text-gray-400">
            {isSignUp ? "Create your account" : "Welcome back"}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl bg-white p-6 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full rounded-2xl border border-warm-200 bg-[#f6eee9] px-4 py-3 text-sm text-gray-800 placeholder-gray-300 outline-none transition-all focus:border-[#ff7a5c] focus:ring-2 focus:ring-[#ff7a5c]/15"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete={isSignUp ? "new-password" : "current-password"}
                className="w-full rounded-2xl border border-warm-200 bg-[#f6eee9] px-4 py-3 text-sm text-gray-800 placeholder-gray-300 outline-none transition-all focus:border-[#ff7a5c] focus:ring-2 focus:ring-[#ff7a5c]/15"
              />
            </div>

            {error && <InlineError message={error} />}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl py-3 text-sm font-semibold text-white transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              style={{
                background: "#ff7a5c",
                boxShadow: "0 4px 16px rgba(255,122,92,0.35)",
              }}
            >
              {loading ? "Loading…" : isSignUp ? "Create account" : "Sign in"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-warm-100" />
            <span className="text-xs text-gray-300">or</span>
            <div className="h-px flex-1 bg-warm-100" />
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogle}
            className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-warm-200 bg-[#f6eee9] py-3 text-sm font-medium text-gray-600 transition-all hover:bg-warm-100"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <p className="mt-5 text-center text-sm text-gray-400">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
              className="font-semibold transition-colors"
              style={{ color: "#ff7a5c" }}
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
