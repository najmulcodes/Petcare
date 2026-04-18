import { Link } from "react-router-dom";

const features = [
  {
    emoji: "💸",
    title: "Track Expenses",
    description: "Log food, vet visits, and everyday pet spending in seconds.",
  },
  {
    emoji: "🐾",
    title: "Manage Pet Profiles",
    description: "Keep each pet's details, photo, and notes neatly organized.",
  },
  {
    emoji: "💉",
    title: "Vaccines & Reminders",
    description: "Stay on top of due dates without messy notes or missed follow-ups.",
  },
];

const steps = [
  {
    title: "Add your pets",
    description: "Create a profile for each pet and keep their essentials in one place.",
  },
  {
    title: "Track daily care",
    description: "Save vaccinations, routines, and notes as life happens.",
  },
  {
    title: "See the full picture",
    description: "Review care history and spending from one clear dashboard.",
  },
];

export function HomePage() {
  return (
    <div className="min-h-screen pt-14">
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/80 bg-white/85 px-4 py-2 text-sm font-semibold text-[#8c776f] shadow-sm backdrop-blur-sm">
              <img src="/paw-icon.svg" className="w-4 h-4" />
              Pet care + expense tracking
            </div>

            <div className="space-y-4">
              <h1 className="font-display text-4xl font-semibold leading-tight text-[#221a16] sm:text-5xl lg:text-6xl">
                All your pet care, health, and expenses — in one place
              </h1>
              <p className="max-w-xl text-base leading-8 text-[#7e6d66] sm:text-lg">
                Track vaccinations, daily care, and spending without messy notes or scattered apps.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/login?mode=signup"
                className="inline-flex items-center justify-center rounded-2xl px-6 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-xl"
                style={{ background: "#ff7a5c", boxShadow: "0 16px 32px rgba(255, 122, 92, 0.22)" }}
              >
                Get Started
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-2xl border border-warm-200 bg-white/85 px-6 py-3.5 text-sm font-semibold text-gray-700 transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-lg"
              >
                See how it works
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-x-10 top-8 h-32 rounded-full bg-[#ffd9cc]/60 blur-3xl" />
            <img
              src="/banner.png"
              alt="Whisker Diary app preview"
              className="relative w-full rounded-3xl object-cover shadow-xl max-h-[520px]"
            />
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="space-y-4">
          <div className="app-chip">Core features</div>
          <h2 className="font-display text-3xl font-semibold leading-tight text-[#221a16] sm:text-4xl">
            Built for everyday pet management
          </h2>
          <p className="max-w-xl text-sm leading-7 text-[#7e6d66] sm:text-base">
            Keep your most important care details visible, simple, and easy to update.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-white/80 bg-white/90 p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff4f1] text-2xl">
                {feature.emoji}
              </div>
              <h3 className="mt-5 text-xl font-semibold text-[#221a16]">{feature.title}</h3>
              <p className="mt-2 max-w-xs text-sm leading-7 text-[#7e6d66]">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="rounded-[32px] border border-white/80 bg-white/90 p-8 shadow-xl">
          <div className="space-y-4">
            <div className="app-chip">How it works</div>
            <h2 className="font-display text-3xl font-semibold leading-tight text-[#221a16] sm:text-4xl">
              Start fast and stay organized
            </h2>
            <p className="max-w-xl text-sm leading-7 text-[#7e6d66] sm:text-base">
              Set up your account once, then keep every pet detail and expense where you can actually find it.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-3xl bg-[#fff8f4] p-5 shadow-lg">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-sm font-bold text-[#ff7a5c] shadow-sm">
                  {index + 1}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[#221a16]">{step.title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-7 text-[#7e6d66]">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div
          className="rounded-[32px] p-8 text-white shadow-xl sm:p-10"
          style={{ background: "linear-gradient(145deg, #ff8a6f 0%, #ff7a5c 52%, #e55f41 100%)" }}
        >
          <div className="space-y-4">
            <div className="inline-flex items-center rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white/85">
              Ready to simplify pet care?
            </div>
            <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
              Keep every care detail and expense in one product you will actually use
            </h2>
            <p className="max-w-xl text-sm leading-7 text-white/80 sm:text-base">
              Start with one pet, add records as you go, and get a cleaner view of health and spending right away.
            </p>
            <Link
              to="/login?mode=signup"
              className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-[#e55f41] transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
