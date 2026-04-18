import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { usePets } from "../../hooks/usePets";
import { useExpenses } from "../../hooks/useExpenses";
import { PageSpinner } from "../../components/ui/Spinner";
import { ErrorState } from "../../components/ui/ErrorState";
import { EntityAvatar } from "../../components/ui/EntityAvatar";
import { getUserAvatarUrl, getUserDisplayName } from "../../lib/user";

function getMonthString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonthLabel(date: Date): string {
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(date);
}

function formatBDT(amount: number): string {
  return `BDT ${Number(amount).toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function DashboardPage() {
  const { user } = useAuth();
  const { data: pets, isLoading: petsLoading, error: petsError, refetch: refetchPets } = usePets();
  const currentDate = new Date();
  const currentMonth = getMonthString(currentDate);
  const monthLabel = formatMonthLabel(currentDate);
  const { data: expenses, isLoading: expensesLoading, error: expensesError, refetch: refetchExpenses } = useExpenses(currentMonth);

  if (petsLoading || expensesLoading) return <PageSpinner />;
  if (petsError) return <ErrorState message="Failed to load pets." onRetry={() => refetchPets()} />;
  if (expensesError) return <ErrorState message="Failed to load expenses." onRetry={() => refetchExpenses()} />;

  const displayName = getUserDisplayName(user);
  const avatarUrl = getUserAvatarUrl(user);
  const total = expenses?.reduce((sum, expense) => sum + Number(expense.amount_bdt), 0) ?? 0;
  const recentExpenses = expenses?.slice(0, 5) ?? [];
  const latestPet = pets?.[0];
  const quickActions = [
    { label: "Add a pet", description: "Create a new profile", to: "/pets/add" },
    { label: "Log expense", description: "Track spending quickly", to: "/expenses/add" },
    { label: "Update profile", description: "Refresh your account details", to: "/profile" },
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(21rem,0.95fr)]">
      <div className="space-y-6">
        <section
          className="overflow-hidden rounded-[32px] p-6 text-white shadow-card sm:p-8"
          style={{ background: "linear-gradient(145deg, #ff8a6f 0%, #ff7a5c 50%, #e76243 100%)" }}
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/75">Dashboard</p>
              <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">{displayName}</h1>
              <p className="max-w-xl text-sm leading-7 text-white/80 sm:text-base">
                Keep an eye on your pets, recent spending, and the everyday records that help you stay ahead of care.
              </p>
            </div>

            <div className="flex items-center gap-4 rounded-[26px] bg-white/12 px-4 py-4 backdrop-blur-sm sm:px-5">
              <EntityAvatar
                src={avatarUrl}
                name={displayName}
                kind="user"
                className="h-14 w-14 rounded-2xl border border-white/25"
                textClassName="text-base text-white"
              />
              <div>
                <p className="text-sm font-semibold">{displayName}</p>
                <p className="text-xs text-white/70">{user?.email}</p>
                <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-white/65">{monthLabel}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="app-panel p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#b28d80]">Pets</p>
            <p className="mt-4 text-3xl font-semibold text-[#221a16]">{pets?.length ?? 0}</p>
            <p className="mt-2 text-sm text-[#7e6d66]">Profiles currently in your care space.</p>
          </div>
          <div className="app-panel p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#b28d80]">This month</p>
            <p className="mt-4 text-3xl font-semibold text-[#221a16]">{formatBDT(total)}</p>
            <p className="mt-2 text-sm text-[#7e6d66]">Tracked home expenses for {monthLabel}.</p>
          </div>
          <div className="app-panel p-5 sm:col-span-2 xl:col-span-1">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#b28d80]">Recent activity</p>
            <p className="mt-4 text-3xl font-semibold text-[#221a16]">{expenses?.length ?? 0}</p>
            <p className="mt-2 text-sm text-[#7e6d66]">Transactions logged this month so far.</p>
          </div>
        </section>

        <section className="app-panel p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b28d80]">Spending</p>
              <h2 className="mt-1 text-xl font-semibold text-[#221a16]">Recent expenses</h2>
            </div>
            <Link
              to="/expenses/add"
              className="inline-flex rounded-2xl px-4 py-2 text-sm font-semibold text-white"
              style={{ background: "#ff7a5c" }}
            >
              Add expense
            </Link>
          </div>

          {recentExpenses.length === 0 ? (
            <div className="rounded-[24px] bg-[#fff8f4] px-5 py-8 text-center">
              <p className="text-lg font-semibold text-[#221a16]">No expenses logged yet</p>
              <p className="mt-2 text-sm leading-7 text-[#7e6d66]">
                Record food, care, or household spending to start building a clearer monthly picture.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex flex-col gap-3 rounded-[24px] border border-[#f1e3da] bg-[#fffaf7] px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#221a16]">{expense.description ?? "Untitled expense"}</p>
                    <p className="mt-1 text-sm text-[#7e6d66]">
                      {expense.category?.name ?? "Uncategorized"} · {expense.date}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-sm font-semibold text-[#ff7a5c]">{formatBDT(Number(expense.amount_bdt))}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#b28d80]">Recorded</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <aside className="space-y-6">
        <section className="app-panel p-5 sm:p-6">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b28d80]">Quick actions</p>
            <h2 className="mt-1 text-xl font-semibold text-[#221a16]">Keep things moving</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {quickActions.map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className="rounded-[24px] border border-[#f1e3da] bg-[#fff8f4] px-4 py-4 transition-colors hover:bg-white"
              >
                <p className="text-sm font-semibold text-[#221a16]">{action.label}</p>
                <p className="mt-1 text-sm leading-7 text-[#7e6d66]">{action.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="app-panel p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b28d80]">Pets</p>
              <h2 className="mt-1 text-xl font-semibold text-[#221a16]">Your pet roster</h2>
            </div>
            <Link to="/pets" className="text-sm font-semibold text-[#ff7a5c]">
              View all
            </Link>
          </div>

          {!pets || pets.length === 0 ? (
            <div className="rounded-[24px] bg-[#fff8f4] px-5 py-8 text-center">
              <p className="text-lg font-semibold text-[#221a16]">Add your first pet</p>
              <p className="mt-2 text-sm leading-7 text-[#7e6d66]">
                Once a pet profile is in place, vaccinations, medications, and notes all have a clear home.
              </p>
              <Link
                to="/pets/add"
                className="mt-4 inline-flex rounded-2xl px-4 py-2 text-sm font-semibold text-white"
                style={{ background: "#ff7a5c" }}
              >
                Create profile
              </Link>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {pets.slice(0, 4).map((pet) => (
                <Link
                  key={pet.id}
                  to={`/pets/${pet.id}`}
                  className="flex items-center gap-4 rounded-[24px] border border-[#f1e3da] bg-[#fffaf7] px-4 py-4 transition-colors hover:bg-white"
                >
                  <EntityAvatar
                    src={pet.image}
                    name={pet.name}
                    kind="pet"
                    className="h-14 w-14 rounded-2xl"
                    textClassName="text-base"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#221a16]">{pet.name}</p>
                    <p className="mt-1 truncate text-sm text-[#7e6d66]">
                      {[pet.breed, pet.gender].filter(Boolean).join(" · ") || "Profile ready for care records"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-[32px] border border-[#f1e3da] bg-[#fff8f4] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b28d80]">Snapshot</p>
          <h2 className="mt-2 text-xl font-semibold text-[#221a16]">At a glance</h2>
          <p className="mt-3 text-sm leading-7 text-[#7e6d66]">
            {latestPet
              ? `${latestPet.name} is the newest profile in your workspace. Keep adding records here to build a useful long-term history.`
              : "Your dashboard becomes more useful as you add pets, care details, and monthly expenses."}
          </p>
        </section>
      </aside>
    </div>
  );
}
