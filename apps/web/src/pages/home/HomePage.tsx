import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const features = [
  {
    title: "Pet profiles that stay tidy",
    description: "Keep each pet's photo, identity details, history, and care notes together so the whole household knows what matters.",
  },
  {
    title: "Vaccines, meds, and reminders",
    description: "Track routine care, spot upcoming due dates, and keep important records in a place that is easy to update on the go.",
  },
  {
    title: "Expense visibility without spreadsheets",
    description: "See recent spending and monthly totals quickly, whether you are budgeting for food, vet visits, or recurring care.",
  },
];

const steps = [
  {
    label: "01",
    title: "Create your space",
    description: "Start with your account, add your name, and bring each pet into one calm home base.",
  },
  {
    label: "02",
    title: "Capture everyday records",
    description: "Save pet details, upload photos, log vaccines, and record costs as life happens.",
  },
  {
    label: "03",
    title: "Stay ahead of care",
    description: "Use the dashboard to review spending, upcoming needs, and the records you may need at a glance.",
  },
];

const trustPoints = [
  "Built for real pet households, not a one-page demo.",
  "Simple enough for daily use, structured enough for long-term history.",
  "Warm, low-stress design that works across phone, tablet, and desktop.",
];

export function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen pt-20">
      <section className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8 xl:px-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)] lg:items-center">
          <div className="space-y-6">
            <div className="app-chip">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              One calm place for pet care and spending
            </div>

            <div className="space-y-4">
              <h1 className="font-display text-4xl font-semibold leading-tight text-[#221a16] sm:text-5xl lg:text-6xl">
                Keep every pet detail, care record, and expense in one polished home.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[#7e6d66] sm:text-lg">
                Whisker Diary helps pet parents organize the daily details that are easy to lose: profiles, vaccines,
                medication notes, reminders, and the cost of caring well.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to={user ? "/dashboard" : "/login"}
                className="inline-flex items-center justify-center rounded-2xl px-6 py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.01]"
                style={{ background: "#ff7a5c", boxShadow: "0 16px 32px rgba(255, 122, 92, 0.22)" }}
              >
                {user ? "Open your dashboard" : "Create your account"}
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-2xl border border-warm-200 bg-white/85 px-6 py-3.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-white"
              >
                See how it works
              </a>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="app-panel px-5 py-4">
                <p className="text-2xl font-semibold text-[#221a16]">Profiles</p>
                <p className="mt-1 text-sm text-[#7e6d66]">Photo-ready pet records with the details you actually revisit.</p>
              </div>
              <div className="app-panel px-5 py-4">
                <p className="text-2xl font-semibold text-[#221a16]">Care</p>
                <p className="mt-1 text-sm text-[#7e6d66]">Vaccination history, medication logs, and upcoming needs in one flow.</p>
              </div>
              <div className="app-panel px-5 py-4">
                <p className="text-2xl font-semibold text-[#221a16]">Spending</p>
                <p className="mt-1 text-sm text-[#7e6d66]">Monthly clarity without hunting through messages or receipts.</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-x-8 top-6 h-28 rounded-full bg-[#ffd9cc]/50 blur-3xl" />
            <div className="app-panel relative overflow-hidden p-5 sm:p-6">
              <div className="rounded-[24px] border border-[#f2e3da] bg-[#fff8f4] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#b28d80]">Dashboard</p>
                    <h2 className="mt-2 text-2xl font-semibold text-[#221a16]">A softer way to stay organized</h2>
                  </div>
                  <div className="rounded-2xl bg-white px-3 py-2 text-right shadow-soft">
                    <p className="text-xs text-[#8c776f]">This month</p>
                    <p className="text-lg font-semibold text-[#221a16]">Health + home</p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[22px] bg-white p-4 shadow-soft">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b28d80]">Care status</p>
                    <div className="mt-4 space-y-3">
                      <div className="rounded-2xl bg-[#fff4f1] px-4 py-3">
                        <p className="text-sm font-semibold text-[#221a16]">Rabies booster due soon</p>
                        <p className="mt-1 text-xs text-[#8c776f]">Keep records and due dates beside the pet profile.</p>
                      </div>
                      <div className="rounded-2xl bg-[#f6eee9] px-4 py-3">
                        <p className="text-sm font-semibold text-[#221a16]">Medication schedule tracked</p>
                        <p className="mt-1 text-xs text-[#8c776f]">Simple lists that stay readable on mobile and desktop.</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[22px] bg-white p-4 shadow-soft">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b28d80]">Recent activity</p>
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center justify-between rounded-2xl border border-[#f3e5dc] px-4 py-3">
                        <div>
                          <p className="text-sm font-semibold text-[#221a16]">Food restock</p>
                          <p className="text-xs text-[#8c776f]">Quickly logged</p>
                        </div>
                        <span className="text-sm font-semibold text-[#ff7a5c]">BDT 2,350</span>
                      </div>
                      <div className="flex items-center justify-between rounded-2xl border border-[#f3e5dc] px-4 py-3">
                        <div>
                          <p className="text-sm font-semibold text-[#221a16]">Vet follow-up saved</p>
                          <p className="text-xs text-[#8c776f]">Record stays attached</p>
                        </div>
                        <span className="text-sm font-semibold text-[#221a16]">Today</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-[24px] bg-[#221a16] px-5 py-4 text-white">
                  <p className="text-sm font-semibold">Designed to help you decide quickly</p>
                  <p className="mt-1 text-sm text-white/70">
                    If you want one place to manage pet records and spending without a complicated setup, this is what Whisker Diary is for.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 xl:px-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
          <div className="space-y-4">
            <div className="app-chip">What you get</div>
            <h2 className="section-heading">A clear product for everyday pet care, not a cluttered tracker.</h2>
            <p className="section-copy">
              The goal is simple: make it easy to know what happened, what is due next, and what you spent without turning pet care into admin work.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="app-panel h-full p-5">
                <p className="text-lg font-semibold text-[#221a16]">{feature.title}</p>
                <p className="mt-3 text-sm leading-7 text-[#7e6d66]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 xl:px-10">
        <div className="app-panel overflow-hidden p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-start">
            <div className="space-y-4">
              <div className="app-chip">How it works</div>
              <h2 className="section-heading">From sign-up to daily use in a few calm steps.</h2>
              <p className="section-copy">
                You do not need a big setup session. Add your account, bring in your pets, and start recording what matters as you go.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {steps.map((step) => (
                <div key={step.label} className="rounded-[24px] border border-[#f1e3da] bg-[#fff8f4] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#b28d80]">{step.label}</p>
                  <p className="mt-4 text-lg font-semibold text-[#221a16]">{step.title}</p>
                  <p className="mt-3 text-sm leading-7 text-[#7e6d66]">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 xl:px-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.9fr)]">
          <div className="app-panel p-6 sm:p-8">
            <div className="app-chip">Why people stay</div>
            <h2 className="mt-4 section-heading">Useful enough to keep open, gentle enough to trust with your routine.</h2>
            <div className="mt-6 space-y-4">
              {trustPoints.map((point) => (
                <div key={point} className="flex items-start gap-3 rounded-2xl bg-[#fff8f4] px-4 py-4">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#ff7a5c]" />
                  <p className="text-sm leading-7 text-[#5f4d46]">{point}</p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="rounded-[32px] p-6 text-white shadow-card sm:p-8"
            style={{ background: "linear-gradient(145deg, #ff8a6f 0%, #ff7a5c 45%, #e55f41 100%)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/75">Ready to decide?</p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight">Start with your first pet profile and build from there.</h2>
            <p className="mt-4 text-sm leading-7 text-white/80">
              Whisker Diary is best for people who want practical organization: records, reminders, and spending clarity without a complicated learning curve.
            </p>
            <Link
              to={user ? "/dashboard" : "/login"}
              className="mt-6 inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-[#e55f41] transition-transform hover:scale-[1.01]"
            >
              {user ? "Go to dashboard" : "Sign up and get organized"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
