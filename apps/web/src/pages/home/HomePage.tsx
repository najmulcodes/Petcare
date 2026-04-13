import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const features = [
  {
    emoji: "🐾",
    label: "Pets",
    title: "Pet Profiles",
    desc: "Health history, weight tracking, breed info, and birthday reminders.",
    bg: "bg-[#fff4f1]",
  },
  {
    emoji: "💰",
    label: "Expenses",
    title: "Expense Tracking",
    desc: "Track every cost with monthly insights and per-pet breakdown.",
    bg: "bg-[#f0faf5]",
  },
  {
    emoji: "🔔",
    label: "Reminders",
    title: "Smart Alerts",
    desc: "Never miss vaccinations, meds, or vet visits again.",
    bg: "bg-[#fefbf0]",
  },
];

export function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#f6eee9]">
      <div className="h-14" />

      {/* HERO */}
      <section className="mx-auto max-w-md px-4 pt-12 pb-12 text-center">
        <div className="mb-4 text-6xl">🐾</div>

        <h1 className="text-3xl font-bold text-gray-900 leading-snug">
          Care for your pets,{" "}
          <span style={{ color: "#ff7a5c" }}>without the chaos.</span>
        </h1>

        <p className="mt-4 text-sm text-gray-500 leading-relaxed">
          Everything you need to manage pets, expenses, and reminders —
          beautifully organized in one place.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          {user ? (
            <Link
              to="/dashboard"
              className="w-full rounded-3xl py-3.5 text-sm font-semibold text-white text-center transition-all hover:scale-[1.02]"
              style={{
                background: "#ff7a5c",
                boxShadow: "0 10px 30px rgba(255,122,92,0.35)",
              }}
            >
              Go to Dashboard →
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="w-full rounded-3xl py-3.5 text-sm font-semibold text-white text-center transition-all hover:scale-[1.02]"
                style={{
                  background: "#ff7a5c",
                  boxShadow: "0 10px 30px rgba(255,122,92,0.35)",
                }}
              >
                Start for free
              </Link>
              <Link
                to="/login"
                className="w-full rounded-3xl bg-white py-3.5 text-sm font-semibold text-gray-600 text-center shadow-soft"
              >
                I already have an account
              </Link>
            </>
          )}
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="mx-auto max-w-md px-4 pb-12">
        <div className="rounded-3xl bg-white p-6 text-center shadow-soft">
          <p className="text-sm text-gray-600 leading-relaxed">
            “Finally, one place to manage everything for my cats.
            I stopped forgetting vaccinations completely.”
          </p>
          <p className="mt-3 text-xs text-gray-400">— Happy Pet Owner 🐱</p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-md px-4 pb-12">
        <h2 className="mb-4 text-lg font-bold text-gray-900 text-center">
          Everything you need
        </h2>

        <div className="flex flex-col gap-3">
          {features.map((f) => (
            <div
              key={f.label}
              className="flex items-start gap-4 rounded-3xl bg-white p-5 shadow-soft"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${f.bg}`}
              >
                {f.emoji}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  {f.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-md px-4 pb-12">
        <h2 className="mb-4 text-lg font-bold text-gray-900 text-center">
          How it works
        </h2>

        <div className="flex flex-col gap-3">
          {[
            "Create your account in seconds",
            "Add your pets and details",
            "Track expenses & reminders easily",
          ].map((step, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-3xl bg-white p-4 shadow-soft"
            >
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ background: "#ff7a5c" }}
              >
                {i + 1}
              </div>
              <p className="text-sm text-gray-600">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-md px-4 pb-16">
        <div
          className="rounded-3xl p-8 text-center"
          style={{
            background: "linear-gradient(135deg, #ff7a5c 0%, #ff9a7c 100%)",
          }}
        >
          <h2 className="text-xl font-bold text-white mb-2">
            Start managing your pets today
          </h2>

          <p className="text-sm text-white/80 mb-6">
            Simple. Fast. Beautiful.
          </p>

          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-2xl bg-white px-8 py-3 text-sm font-semibold"
            style={{ color: "#ff7a5c" }}
          >
            Create account
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-6 text-center">
        <p className="text-xs text-gray-400">
          🐾 © {new Date().getFullYear()} Whisker Diary
        </p>
      </footer>
    </div>
  );
}