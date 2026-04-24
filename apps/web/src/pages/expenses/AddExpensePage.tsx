import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCreateExpense } from "../../hooks/useExpenses";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { InlineError } from "../../components/ui/ErrorState";

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

export function AddExpensePage() {
  const navigate = useNavigate();
  const createExpense = useCreateExpense();
  const [form, setForm] = useState({ date: todayStr(), amount_bdt: "", description: "" });
  const [error, setError] = useState<string | null>(null);

  function set(field: string, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const amount = parseFloat(form.amount_bdt);
    if (isNaN(amount) || amount <= 0) { setError("Please enter a valid amount."); return; }

    createExpense.mutate(
      { date: form.date, amount_bdt: amount, description: form.description || undefined },
      {
        onSuccess: () => navigate("/expenses"),
        onError: (err) => setError(err instanceof Error ? err.message : "Failed to add expense"),
      }
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/expenses" className="text-sm text-gray-500 hover:text-gray-700">← Back</Link>
        <h1 className="text-2xl font-bold text-gray-900">Add expense</h1>
      </div>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Date *" type="date" value={form.date} onChange={(e) => set("date", e.target.value)} required />

          <Input
            label="Amount (BDT) *"
            prefix="৳"
            type="number"
            min="0.01"
            step="0.01"
            value={form.amount_bdt}
            onChange={(e) => set("amount_bdt", e.target.value)}
            placeholder="0.00"
            required
          />

          <Input
            label="Description"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="e.g. Grocery shopping"
          />

          {error && <InlineError message={error} />}

          <div className="flex gap-3 pt-2">
            <Link to="/expenses" className="flex-1">
              <Button variant="secondary" className="w-full">Cancel</Button>
            </Link>
            <Button type="submit" loading={createExpense.isPending} className="flex-1">Save</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
