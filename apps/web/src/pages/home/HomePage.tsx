import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const features = [
  {
    emoji: "🐾",
    label: "Pets",
    title: "Pet Profiles",
    desc: "Health history, weight tracking, breed info, and birthday reminders all in one place.",
    bg: "bg-[#fff4f1]",
    accent: "text-[#ff7a5c]",
  },
  {
    emoji: "💰",
    label: "Expenses",
    title: "Expense Tracking",
    desc: "Track every dollar spent on home and per-pet costs with monthly summaries.",
    bg: "bg-[#f0faf5]",
    accent: "text-emerald-500",
  },
  {
    emoji: "🔔",
    label: "Reminders",
    title: "Smart Reminders",
    desc: "Auto email alerts for vaccinations, medication, and vet appointments.",
    bg: "bg-[#fefbf0]",
    accent: "text-amber-500",
  },
];

const stats = [
  { value: "100%", label: "Free to use" },
  { value: "3s", label: "Setup time" },
  { value: "0", label: "Missed reminders" },
];

export function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#f6eee9]">
      {/* Navbar spacer */}
      <div className="h-14" />

      {/* Hero */}
      <section className="mx-auto w-full max-w-md px-4 pt-12 pb-10 text-center sm:max-w-2xl lg:max-w-3xl">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-medium text-gray-500 shadow-soft">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Now in public beta
        </div>

        <div className="mb-3 text-6xl">🐾</div>

        <h1 className="text-3xl font-bold text-gray-900 leading-snug tracking-tight">
          Everything your pet needs,{" "}
          <span style={{ color: "#ff7a5c" }}>all in one place.</span>
        </h1>

        <p className="mx-auto mt-4 max-w-xs text-sm text-gray-500 leading-relaxed">
          Track pets, manage expenses, and never miss a reminder.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          {user ? (
            <Link
              to="/dashboard"
              className="w-full rounded-3xl py-3.5 text-sm font-semibold text-white text-center transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: "#ff7a5c", boxShadow: "0 8px 24px rgba(255,122,92,0.35)" }}
            >
              Go to Dashboard →
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="w-full rounded-3xl py-3.5 text-sm font-semibold text-white text-center transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: "#ff7a5c", boxShadow: "0 8px 24px rgba(255,122,92,0.35)" }}
              >
                Get Started — it's free
              </Link>
              <Link
                to="/login"
                className="w-full rounded-3xl border border-warm-200 bg-white py-3.5 text-sm font-semibold text-gray-600 text-center hover:bg-warm-50 transition-colors"
              >
                Sign in
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto w-full max-w-md px-4 pb-10 sm:max-w-2xl lg:max-w-3xl">
        <div className="grid grid-cols-3 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-white p-4 text-center shadow-soft">
              <div className="text-2xl font-bold" style={{ color: "#ff7a5c" }}>{s.value}</div>
              <div className="mt-0.5 text-[11px] text-gray-400 font-medium leading-tight">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-md px-4 pb-10 sm:max-w-2xl lg:max-w-3xl">
        <h2 className="mb-4 text-lg font-bold text-gray-900 text-center">Everything in one place</h2>
        <div className="flex flex-col gap-3 sm:grid sm:grid-cols-3">
          {features.map((f) => (
            <div key={f.label} className="flex items-start gap-4 rounded-3xl bg-white p-5 shadow-soft">
              <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl text-2xl ${f.bg}`}>
                {f.emoji}
              </div>
              <div>
                <p className={`text-[10px] font-semibold tracking-widest uppercase mb-0.5 ${f.accent}`}>{f.label}</p>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{f.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-md px-4 pb-16 sm:max-w-2xl lg:max-w-3xl">
        <div
          className="rounded-3xl p-8 text-center"
          style={{ background: "linear-gradient(135deg, #ff7a5c 0%, #ff9a7c 100%)" }}
        >
          <div className="mb-1 text-3xl">🐶</div>
          <h2 className="text-xl font-bold text-white mb-1">Ready to get organized?</h2>
          <p className="text-sm text-white/70 mb-6">Free forever. No credit card needed.</p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-2xl bg-white px-8 py-3 text-sm font-semibold transition-all hover:scale-[1.02]"
            style={{ color: "#ff7a5c" }}
          >
            Create your account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-warm-200 py-6 text-center">
        <p className="text-xs text-gray-400">🐾 © {new Date().getFullYear()} Whisker Diary · Made with care</p>
      </footer>
    </div>
  );
}
