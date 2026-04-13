import { z } from "zod";

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD");

export const petExpenseQuerySchema = z.object({
  month: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "month must be YYYY-MM")
    .optional(),
});

export const createPetExpenseSchema = z.object({
  date: dateString,
  category: z.enum(["food", "medicine", "vet", "accessories", "other"]),
  amount_bdt: z
    .number({ invalid_type_error: "amount_bdt must be a number" })
    .positive("Amount must be greater than 0")
    .multipleOf(0.01),
  notes: z.string().max(500).optional(),
});

export const updatePetExpenseSchema = createPetExpenseSchema.partial();

export type PetExpenseQueryInput = z.infer<typeof petExpenseQuerySchema>;
export type CreatePetExpenseInput = z.infer<typeof createPetExpenseSchema>;
export type UpdatePetExpenseInput = z.infer<typeof updatePetExpenseSchema>;
