import { supabaseAdmin } from "../../lib/supabase";
import { AppError } from "../../middleware/errorHandler";
import { CreatePetInput, UpdatePetInput } from "./pets.schema";

export async function getAllPets(ownerId: string) {
  const { data, error } = await supabaseAdmin
    .from("pets")
    .select("*")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });
  if (error) throw new AppError(500, error.message);
  return data;
}

export async function getPetById(petId: string, ownerId: string) {
  const { data, error } = await supabaseAdmin
    .from("pets")
    .select("*")
    .eq("id", petId)
    .eq("owner_id", ownerId)
    .single();
  if (error) {
    if (error.code === "PGRST116") throw new AppError(404, "Pet not found");
    throw new AppError(500, error.message);
  }
  return data;
}

export async function createPet(ownerId: string, input: CreatePetInput) {
  const { data, error } = await supabaseAdmin
    .from("pets")
    .insert({
      owner_id: ownerId,
      name: input.name,
      image: input.image ?? null,
      dob: input.dob ?? null,
      breed: input.breed ?? null,
      color: input.color ?? null,
      gender: input.gender ?? null,
      notes: input.notes ?? null,
      food_time: input.food_time ?? null,
    })
    .select()
    .single();
  if (error) throw new AppError(500, error.message);
  return data;
}

export async function updatePet(petId: string, ownerId: string, input: UpdatePetInput) {
  const patch: Record<string, unknown> = {};
  if (input.name !== undefined) patch.name = input.name;
  if (input.image !== undefined) patch.image = input.image;
  if (input.dob !== undefined) patch.dob = input.dob;
  if (input.breed !== undefined) patch.breed = input.breed;
  if (input.color !== undefined) patch.color = input.color;
  if (input.gender !== undefined) patch.gender = input.gender;
  if (input.notes !== undefined) patch.notes = input.notes;
  if (input.food_time !== undefined) patch.food_time = input.food_time;

  if (Object.keys(patch).length === 0) throw new AppError(400, "No fields provided to update");

  const { data, error } = await supabaseAdmin
    .from("pets")
    .update(patch)
    .eq("id", petId)
    .eq("owner_id", ownerId)
    .select()
    .single();
  if (error) {
    if (error.code === "PGRST116") throw new AppError(404, "Pet not found");
    throw new AppError(500, error.message);
  }
  return data;
}

export async function deletePet(petId: string, ownerId: string) {
  const { error, count } = await supabaseAdmin
    .from("pets")
    .delete({ count: "exact" })
    .eq("id", petId)
    .eq("owner_id", ownerId);
  if (error) throw new AppError(500, error.message);
  if (count === 0) throw new AppError(404, "Pet not found");
}
