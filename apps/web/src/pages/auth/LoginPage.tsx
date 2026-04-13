import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/dashboard");
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6eee9] px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6">
        
        {/* Back */}
        <Link
          to="/"
          className="text-sm text-gray-500 hover:text-black mb-4 inline-block"
        >
          ← Back to Home
        </Link>

        <h1 className="text-2xl font-bold mb-6 text-center">
          Welcome Back
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="my-6 text-center text-gray-400">or</div>

        <button
          onClick={handleGoogle}
          className="w-full border rounded-xl py-3 font-medium hover:bg-gray-50 transition"
        >
          Continue with Google
        </button>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?{" "}
          <span
            className="text-orange-500 cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}