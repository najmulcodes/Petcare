import { supabaseAdmin } from "../../lib/supabase";
import { AppError } from "../../middleware/errorHandler";
import { assertPetOwnership } from "../../helpers/assertOwnership";
import { CreateVaccinationInput, UpdateVaccinationInput } from "./vaccinations.schema";

export async function getVaccinations(petId: string, ownerId: string) {
  await assertPetOwnership(petId, ownerId);
  const { data, error } = await supabaseAdmin
    .from("vaccinations")
    .select("*")
    .eq("pet_id", petId)
    .order("administered_at", { ascending: false });
  if (error) throw new AppError(500, error.message);
  return data;
}

export async function getVaccinationById(vaccinationId: string, petId: string, ownerId: string) {
  await assertPetOwnership(petId, ownerId);
  const { data, error } = await supabaseAdmin
    .from("vaccinations")
    .select("*")
    .eq("id", vaccinationId)
    .eq("pet_id", petId)
    .single();
  if (error) {
    if (error.code === "PGRST116") throw new AppError(404, "Vaccination not found");
    throw new AppError(500, error.message);
  }
  return data;
}

export async function createVaccination(petId: string, ownerId: string, input: CreateVaccinationInput) {
  await assertPetOwnership(petId, ownerId);
  const { data, error } = await supabaseAdmin
    .from("vaccinations")
    .insert({
      pet_id: petId,
      vaccine_name: input.vaccine_name,
      administered_at: input.administered_at,
      next_due_at: input.next_due_at ?? null,
      notes: input.notes ?? null,
    })
    .select()
    .single();
  if (error) throw new AppError(500, error.message);
  return data;
}

export async function updateVaccination(vaccinationId: string, petId: string, ownerId: string, input: UpdateVaccinationInput) {
  await assertPetOwnership(petId, ownerId);
  const patch: Record<string, unknown> = {};
  if (input.vaccine_name !== undefined) patch.vaccine_name = input.vaccine_name;
  if (input.administered_at !== undefined) patch.administered_at = input.administered_at;
  if (input.next_due_at !== undefined) patch.next_due_at = input.next_due_at;
  if (input.notes !== undefined) patch.notes = input.notes;
  if (Object.keys(patch).length === 0) throw new AppError(400, "No fields provided to update");

  const { data, error } = await supabaseAdmin
    .from("vaccinations")
    .update(patch)
    .eq("id", vaccinationId)
    .eq("pet_id", petId)
    .select()
    .single();
  if (error) {
    if (error.code === "PGRST116") throw new AppError(404, "Vaccination not found");
    throw new AppError(500, error.message);
  }
  return data;
}

export async function deleteVaccination(vaccinationId: string, petId: string, ownerId: string) {
  await assertPetOwnership(petId, ownerId);
  const { error, count } = await supabaseAdmin
    .from("vaccinations")
    .delete({ count: "exact" })
    .eq("id", vaccinationId)
    .eq("pet_id", petId);
  if (error) throw new AppError(500, error.message);
  if (count === 0) throw new AppError(404, "Vaccination not found");
}
