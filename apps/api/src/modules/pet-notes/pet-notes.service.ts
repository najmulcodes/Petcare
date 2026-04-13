import { supabaseAdmin } from "../../lib/supabase";
import { AppError } from "../../middleware/errorHandler";
import { assertPetOwnership } from "../../helpers/assertOwnership";
import { CreatePetNoteInput, UpdatePetNoteInput } from "./pet-notes.schema";

export async function getPetNotes(petId: string, ownerId: string) {
  await assertPetOwnership(petId, ownerId);
  const { data, error } = await supabaseAdmin
    .from("pet_notes")
    .select("*")
    .eq("pet_id", petId)
    .order("created_at", { ascending: false });
  if (error) throw new AppError(500, error.message);
  return data;
}

export async function createPetNote(petId: string, ownerId: string, input: CreatePetNoteInput) {
  await assertPetOwnership(petId, ownerId);
  const { data, error } = await supabaseAdmin
    .from("pet_notes")
    .insert({ pet_id: petId, content: input.content })
    .select()
    .single();
  if (error) throw new AppError(500, error.message);
  return data;
}

export async function updatePetNote(noteId: string, petId: string, ownerId: string, input: UpdatePetNoteInput) {
  await assertPetOwnership(petId, ownerId);
  if (!input.content) throw new AppError(400, "No fields provided to update");
  const { data, error } = await supabaseAdmin
    .from("pet_notes")
    .update({ content: input.content })
    .eq("id", noteId)
    .eq("pet_id", petId)
    .select()
    .single();
  if (error) {
    if (error.code === "PGRST116") throw new AppError(404, "Note not found");
    throw new AppError(500, error.message);
  }
  return data;
}

export async function deletePetNote(noteId: string, petId: string, ownerId: string) {
  await assertPetOwnership(petId, ownerId);
  const { error, count } = await supabaseAdmin
    .from("pet_notes")
    .delete({ count: "exact" })
    .eq("id", noteId)
    .eq("pet_id", petId);
  if (error) throw new AppError(500, error.message);
  if (count === 0) throw new AppError(404, "Note not found");
}
