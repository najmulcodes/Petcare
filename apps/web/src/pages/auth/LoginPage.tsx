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

    if (authError) {
      setError(authError.message);
      return;
    }

    await requestNotificationPermission();
    notify("Welcome to Whisker Diary 🐾", "You're all set. Track your pets and expenses!");

    navigate("/dashboard");
  }

  async function handleGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // ✅ FIX: dynamic redirect (works local + production)
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) setError(error.message);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f6eee9] px-4 relative">

      <Link
        to="/"
        className="absolute top-5 left-5 inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
      >
        ← Back to home
      </Link>

      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-3 text-5xl">🐾</div>
          <h1 className="text-2xl font-bold text-gray-900">Whisker Diary</h1>
          <p className="mt-1 text-sm text-gray-400">
            {isSignUp ? "Create your account" : "Welcome back"}
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full rounded-2xl border border-warm-200 bg-[#f6eee9] px-4 py-3 text-sm"
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full rounded-2xl border border-warm-200 bg-[#f6eee9] px-4 py-3 text-sm"
            />

            {error && <InlineError message={error} />}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl py-3 text-sm font-semibold text-white"
              style={{ background: "#ff7a5c" }}
            >
              {loading ? "Loading…" : isSignUp ? "Create account" : "Sign in"}
            </button>
          </form>

          <div className="my-5 text-center text-xs text-gray-300">or</div>

          <button
            type="button"
            onClick={handleGoogle}
            className="w-full rounded-2xl border border-warm-200 bg-[#f6eee9] py-3 text-sm"
          >
            Continue with Google
          </button>

          <p className="mt-5 text-center text-sm text-gray-400">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-semibold"
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