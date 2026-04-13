import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { usePets } from "../../hooks/usePets";
import { useExpenses } from "../../hooks/useExpenses";
import { Button } from "../../components/ui/Button";
import { PageSpinner } from "../../components/ui/Spinner";
import { ErrorState } from "../../components/ui/ErrorState";

function getMonthString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function formatBDT(amount: number): string {
  return `৳${Number(amount).toLocaleString("en-BD", { minimumFractionDigits: 2 })}`;
}

export function DashboardPage() {
  const { user } = useAuth();
  const { data: pets, isLoading: petsLoading, error: petsError, refetch: refetchPets } = usePets();
  const currentMonth = getMonthString(new Date());
  const { data: expenses, isLoading: expensesLoading, error: expensesError, refetch: refetchExpenses } = useExpenses(currentMonth);

  if (petsLoading || expensesLoading) return <PageSpinner />;
  if (petsError) return <ErrorState message="Failed to load pets." onRetry={() => refetchPets()} />;
  if (expensesError) return <ErrorState message="Failed to load expenses." onRetry={() => refetchExpenses()} />;

  const total = expenses?.reduce((sum, e) => sum + Number(e.amount_bdt), 0) ?? 0;
  const recentExpenses = expenses?.slice(0, 5) ?? [];
  const firstName = user?.email?.split("@")[0] ?? "there";

  return (
    <div className="space-y-4">
      {/* Greeting */}
      <div
        className="rounded-3xl p-5 text-white"
        style={{ background: "linear-gradient(135deg, #ff7a5c 0%, #ff9a7c 100%)" }}
      >
        <p className="text-sm font-medium text-white/70">Good day,</p>
        <h1 className="text-2xl font-bold capitalize">{firstName} 👋</h1>
        <p className="mt-1 text-xs text-white/60">Here's what's happening today.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-white p-4 shadow-soft text-center">
          <p className="text-2xl font-bold text-gray-900">{pets?.length ?? 0}</p>
          <p className="mt-0.5 text-[11px] text-gray-400">Pets</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-soft text-center">
          <p className="text-lg font-bold text-gray-900 leading-tight">{formatBDT(total)}</p>
          <p className="mt-0.5 text-[11px] text-gray-400">This month</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-soft text-center">
          <p className="text-2xl font-bold text-gray-900">{expenses?.length ?? 0}</p>
          <p className="mt-0.5 text-[11px] text-gray-400">Transactions</p>
        </div>
      </div>

      {/* Pets section */}
      <div className="rounded-3xl bg-white p-5 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900">🐾 My Pets</h2>
          <Link to="/pets/add">
            <button
              className="rounded-xl px-3 py-1.5 text-xs font-semibold text-white"
              style={{ background: "#ff7a5c" }}
            >
              + Add
            </button>
          </Link>
        </div>

        {!pets || pets.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-3xl mb-2">🐣</p>
            <p className="text-sm text-gray-500">No pets added yet.</p>
            <Link to="/pets/add">
              <button
                className="mt-3 rounded-2xl px-5 py-2 text-xs font-semibold text-white"
                style={{ background: "#ff7a5c" }}
              >
                Add your first pet
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {pets.map((pet) => (
              <Link key={pet.id} to={`/pets/${pet.id}`}>
                <div className="flex flex-col items-center rounded-2xl bg-[#fff4f1] p-4 text-center transition-all hover:shadow-soft">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-soft">
                    🐶
                  </div>
                  <p className="mt-2 text-sm font-semibold text-gray-900">{pet.name}</p>
                  {pet.breed && <p className="text-xs text-gray-400">{pet.breed}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent expenses */}
      <div className="rounded-3xl bg-white p-5 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900">💰 Recent Expenses</h2>
          <Link to="/expenses/add">
            <button
              className="rounded-xl px-3 py-1.5 text-xs font-semibold text-white"
              style={{ background: "#ff7a5c" }}
            >
              + Add
            </button>
          </Link>
        </div>

        {recentExpenses.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-400">No expenses recorded this month.</p>
        ) : (
          <ul className="divide-y divide-warm-100">
            {recentExpenses.map((expense) => (
              <li key={expense.id} className="flex items-center justify-between py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{expense.description ?? "—"}</p>
                  <p className="text-xs text-gray-400">{expense.category?.name ?? "Uncategorized"} · {expense.date}</p>
                </div>
                <span
                  className="ml-3 flex-shrink-0 text-sm font-bold"
                  style={{ color: "#ff7a5c" }}
                >
                  {formatBDT(Number(expense.amount_bdt))}
                </span>
              </li>
            ))}
          </ul>
        )}

        {recentExpenses.length > 0 && (
          <Link to="/expenses" className="mt-3 block text-center text-xs font-medium" style={{ color: "#ff7a5c" }}>
            View all expenses →
          </Link>
        )}
      </div>
    </div>
  );
}
