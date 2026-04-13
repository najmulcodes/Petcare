import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface Expense {
  id: string;
  date: string;
  amount_bdt: number;
  description: string | null;
  created_at: string;
  category: { id: string; name: string; color: string; icon: string | null } | null;
}

export interface CreateExpenseInput {
  date: string;
  amount_bdt: number;
  description?: string;
  category_id?: string;
}

async function fetchExpenses(month?: string): Promise<Expense[]> {
  const res = await api.get<{ success: boolean; data: Expense[] }>("/expenses", {
    params: month ? { month } : {},
  });
  return res.data.data;
}

async function createExpense(input: CreateExpenseInput): Promise<Expense> {
  const res = await api.post<{ success: boolean; data: Expense }>("/expenses", input);
  return res.data.data;
}

async function updateExpense({ id, ...input }: Partial<CreateExpenseInput> & { id: string }): Promise<Expense> {
  const res = await api.patch<{ success: boolean; data: Expense }>(`/expenses/${id}`, input);
  return res.data.data;
}

async function deleteExpense(id: string): Promise<void> {
  await api.delete(`/expenses/${id}`);
}

export function useExpenses(month?: string) {
  return useQuery({
    queryKey: ["expenses", month ?? "all"],
    queryFn: () => fetchExpenses(month),
  });
}

export function useCreateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createExpense,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["expenses"] }),
  });
}

export function useUpdateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateExpense,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["expenses"] }),
  });
}

export function useDeleteExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["expenses"] }),
  });
}
