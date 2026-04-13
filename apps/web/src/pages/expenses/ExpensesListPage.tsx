import { useState } from "react";
import { Link } from "react-router-dom";
import { useExpenses, useDeleteExpense } from "../../hooks/useExpenses";
import { Card, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { PageSpinner } from "../../components/ui/Spinner";
import { ErrorState } from "../../components/ui/ErrorState";

function getMonthString(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function stepMonth(current: string, dir: -1 | 1): string {
  const [y, m] = current.split("-").map(Number);
  const d = new Date(y, m - 1 + dir, 1);
  return getMonthString(d);
}

function formatMonthLabel(month: string): string {
  const [y, m] = month.split("-");
  return new Date(Number(y), Number(m) - 1, 1).toLocaleString("default", { month: "long", year: "numeric" });
}

function formatBDT(amount: number): string {
  return `৳${Number(amount).toLocaleString("en-BD", { minimumFractionDigits: 2 })}`;
}

export function ExpensesListPage() {
  const [month, setMonth] = useState(getMonthString(new Date()));
  const { data: expenses, isLoading, error, refetch } = useExpenses(month);
  const deleteExpense = useDeleteExpense();

  const total = expenses?.reduce((sum, e) => sum + Number(e.amount_bdt), 0) ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">💰 Spendly</h1>
          <p className="text-sm text-gray-500">Home expense tracker</p>
        </div>
        <Link to="/expenses/add"><Button>+ Add</Button></Link>
      </div>

      {/* Month picker */}
      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
        <button onClick={() => setMonth(stepMonth(month, -1))} className="rounded-lg px-2 py-1 text-gray-500 hover:bg-gray-100">‹ Prev</button>
        <span className="text-sm font-semibold text-gray-800">{formatMonthLabel(month)}</span>
        <button onClick={() => setMonth(stepMonth(month, 1))} className="rounded-lg px-2 py-1 text-gray-500 hover:bg-gray-100">Next ›</button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <p className="text-sm text-gray-500">Total this month</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{formatBDT(total)}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Transactions</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{expenses?.length ?? 0}</p>
        </Card>
      </div>

      {/* List */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>

        {isLoading && <PageSpinner />}
        {error && <ErrorState message="Failed to load expenses." onRetry={() => refetch()} />}

        {!isLoading && !error && (!expenses || expenses.length === 0) && (
          <div className="py-10 text-center">
            <p className="text-sm text-gray-500">No expenses for {formatMonthLabel(month)}.</p>
            <Link to="/expenses/add"><Button size="sm" className="mt-3">Add expense</Button></Link>
          </div>
        )}

        {expenses && expenses.length > 0 && (
          <ul className="divide-y divide-gray-100">
            {expenses.map((expense) => (
              <li key={expense.id} className="flex items-center justify-between py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">{expense.description ?? "—"}</p>
                  <div className="mt-0.5 flex items-center gap-2">
                    {expense.category && (
                      <span
                        className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                        style={{ backgroundColor: `${expense.category.color}20`, color: expense.category.color }}
                      >
                        {expense.category.name}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">{expense.date}</span>
                  </div>
                </div>
                <div className="ml-4 flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-900">{formatBDT(Number(expense.amount_bdt))}</span>
                  <button
                    onClick={() => { if (confirm("Delete this expense?")) deleteExpense.mutate(expense.id); }}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
