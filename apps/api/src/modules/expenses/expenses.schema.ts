import { z } from "zod";

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD");

export const expenseQuerySchema = z.object({
  month: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "month must be YYYY-MM")
    .optional(),
});

export const createExpenseSchema = z.object({
  date: dateString,
  category_id: z.string().uuid("category_id must be a valid UUID").optional(),
  amount_bdt: z
    .number({ invalid_type_error: "amount_bdt must be a number" })
    .positive("Amount must be greater than 0")
    .multipleOf(0.01),
  description: z.string().max(500).optional(),
});

export const updateExpenseSchema = createExpenseSchema.partial();

export type ExpenseQueryInput = z.infer<typeof expenseQuerySchema>;
export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
