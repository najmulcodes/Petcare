import { z } from "zod";

export const createPetNoteSchema = z.object({
  content: z.string().min(1, "Content is required").max(5000),
});

export const updatePetNoteSchema = createPetNoteSchema.partial();

export type CreatePetNoteInput = z.infer<typeof createPetNoteSchema>;
export type UpdatePetNoteInput = z.infer<typeof updatePetNoteSchema>;
