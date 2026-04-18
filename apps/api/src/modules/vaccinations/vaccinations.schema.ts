import { z } from "zod";

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD");

export const createVaccinationSchema = z.object({
  vaccine_name: z.string().min(1, "Vaccine name is required").max(200),
  administered_at: dateString,
  next_due_at: dateString.optional(),
  notes: z.string().max(1000).optional(),
  card_image_url: z.string().url().optional(),
  ocr_text: z.string().max(12000).optional(),
});

export const updateVaccinationSchema = createVaccinationSchema.partial();

export type CreateVaccinationInput = z.infer<typeof createVaccinationSchema>;
export type UpdateVaccinationInput = z.infer<typeof updateVaccinationSchema>;
