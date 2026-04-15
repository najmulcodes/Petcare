import { z } from "zod";

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD");

export const createPetSchema = z.object({
  image: z.string().url().optional(),
  name: z.string().min(1, "Name is required").max(100),
  dob: dateString.optional(),
  breed: z.string().max(100).optional(),
  color: z.string().max(100).optional(),
  gender: z.enum(["male", "female", "unknown"]).optional(),
  notes: z.string().max(2000).optional(),
});

export const updatePetSchema = createPetSchema.partial();

export type CreatePetInput = z.infer<typeof createPetSchema>;
export type UpdatePetInput = z.infer<typeof updatePetSchema>;
