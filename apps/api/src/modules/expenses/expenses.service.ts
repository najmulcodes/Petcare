import { supabaseAdmin } from "../../lib/supabase";
import { AppError } from "../../middleware/errorHandler";
import { CreateExpenseInput, UpdateExpenseInput, ExpenseQueryInput } from "./expenses.schema";

function buildMonthRange(month: string): { from: string; to: string } {
  const [year, m] = month.split("-").map(Number);
  const from = `${month}-01`;
  const nextMonth = m === 12 ? 1 : m + 1;
  const nextYear = m === 12 ? year + 1 : year;
  const to = `${String(nextYear).padStart(4, "0")}-${String(nextMonth).padStart(2, "0")}-01`;
  return { from, to };
}

const EXPENSE_SELECT = `
  id, date, amount_bdt, description, created_at,
  category:expense_categories (id, name, color, icon)
`;

export async function getExpenses(ownerId: string, query: ExpenseQueryInput) {
  let builder = supabaseAdmin
    .from("home_expenses")
    .select(EXPENSE_SELECT)
    .eq("owner_id", ownerId)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (query.month) {
    const { from, to } = buildMonthRange(query.month);
    builder = builder.gte("date", from).lt("date", to);
  }

  const { data, error } = await builder;
  if (error) throw new AppError(500, error.message);
  return data;
}

export async function createExpense(ownerId: string, input: CreateExpenseInput) {
  const { data, error } = await supabaseAdmin
    .from("home_expenses")
    .insert({
      owner_id: ownerId,
      date: input.date,
      category_id: input.category_id ?? null,
      amount_bdt: input.amount_bdt,
      description: input.description ?? null,
    })
    .select(EXPENSE_SELECT)
    .single();
  if (error) throw new AppError(500, error.message);
  return data;
}

export async function updateExpense(expenseId: string, ownerId: string, input: UpdateExpenseInput) {
  const patch: Record<string, unknown> = {};
  if (input.date !== undefined) patch.date = input.date;
  if (input.category_id !== undefined) patch.category_id = input.category_id;
  if (input.amount_bdt !== undefined) patch.amount_bdt = input.amount_bdt;
  if (input.description !== undefined) patch.description = input.description;
  if (Object.keys(patch).length === 0) throw new AppError(400, "No fields provided to update");

  const { data, error } = await supabaseAdmin
    .from("home_expenses")
    .update(patch)
    .eq("id", expenseId)
    .eq("owner_id", ownerId)
    .select(EXPENSE_SELECT)
    .single();
  if (error) {
    if (error.code === "PGRST116") throw new AppError(404, "Expense not found");
    throw new AppError(500, error.message);
  }
  return data;
}

export async function deleteExpense(expenseId: string, ownerId: string) {
  const { error, count } = await supabaseAdmin
    .from("home_expenses")
    .delete({ count: "exact" })
    .eq("id", expenseId)
    .eq("owner_id", ownerId);
  if (error) throw new AppError(500, error.message);
  if (count === 0) throw new AppError(404, "Expense not found");
}
