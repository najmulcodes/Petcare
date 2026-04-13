import { z } from "zod";

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD");

export const createMedicationSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  dosage: z.string().min(1, "Dosage is required").max(200),
  frequency: z.enum(["daily", "weekly", "custom"]),
  schedule_config: z.record(z.unknown()).optional().default({}),
  start_date: dateString,
  end_date: dateString.optional(),
  is_active: z.boolean().optional().default(true),
});

export const updateMedicationSchema = createMedicationSchema.partial();

export type CreateMedicationInput = z.infer<typeof createMedicationSchema>;
export type UpdateMedicationInput = z.infer<typeof updateMedicationSchema>;
