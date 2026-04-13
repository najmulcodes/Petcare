import { z } from "zod";

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD");

export const createVetVisitSchema = z.object({
  visit_date: dateString,
  reason: z.string().min(1, "Reason is required").max(500),
  vet_name: z.string().max(200).optional(),
  notes: z.string().max(2000).optional(),
  cost_bdt: z.number().nonnegative("Cost cannot be negative").multipleOf(0.01).optional(),
});

export const updateVetVisitSchema = createVetVisitSchema.partial();

export type CreateVetVisitInput = z.infer<typeof createVetVisitSchema>;
export type UpdateVetVisitInput = z.infer<typeof updateVetVisitSchema>;
