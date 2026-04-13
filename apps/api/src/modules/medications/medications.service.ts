import { supabaseAdmin } from "../../lib/supabase";
import { AppError } from "../../middleware/errorHandler";
import { assertPetOwnership } from "../../helpers/assertOwnership";
import { CreateMedicationInput, UpdateMedicationInput } from "./medications.schema";

export async function getMedications(petId: string, ownerId: string) {
  await assertPetOwnership(petId, ownerId);
  const { data, error } = await supabaseAdmin
    .from("medications")
    .select("*")
    .eq("pet_id", petId)
    .order("created_at", { ascending: false });
  if (error) throw new AppError(500, error.message);
  return data;
}

export async function getMedicationById(medicationId: string, petId: string, ownerId: string) {
  await assertPetOwnership(petId, ownerId);
  const { data, error } = await supabaseAdmin
    .from("medications")
    .select("*")
    .eq("id", medicationId)
    .eq("pet_id", petId)
    .single();
  if (error) {
    if (error.code === "PGRST116") throw new AppError(404, "Medication not found");
    throw new AppError(500, error.message);
  }
  return data;
}

export async function createMedication(petId: string, ownerId: string, input: CreateMedicationInput) {
  await assertPetOwnership(petId, ownerId);
  const { data, error } = await supabaseAdmin
    .from("medications")
    .insert({
      pet_id: petId,
      name: input.name,
      dosage: input.dosage,
      frequency: input.frequency,
      schedule_config: input.schedule_config ?? {},
      start_date: input.start_date,
      end_date: input.end_date ?? null,
      is_active: input.is_active ?? true,
    })
    .select()
    .single();
  if (error) throw new AppError(500, error.message);
  return data;
}

export async function updateMedication(medicationId: string, petId: string, ownerId: string, input: UpdateMedicationInput) {
  await assertPetOwnership(petId, ownerId);
  const patch: Record<string, unknown> = {};
  if (input.name !== undefined) patch.name = input.name;
  if (input.dosage !== undefined) patch.dosage = input.dosage;
  if (input.frequency !== undefined) patch.frequency = input.frequency;
  if (input.schedule_config !== undefined) patch.schedule_config = input.schedule_config;
  if (input.start_date !== undefined) patch.start_date = input.start_date;
  if (input.end_date !== undefined) patch.end_date = input.end_date;
  if (input.is_active !== undefined) patch.is_active = input.is_active;
  if (Object.keys(patch).length === 0) throw new AppError(400, "No fields provided to update");

  const { data, error } = await supabaseAdmin
    .from("medications")
    .update(patch)
    .eq("id", medicationId)
    .eq("pet_id", petId)
    .select()
    .single();
  if (error) {
    if (error.code === "PGRST116") throw new AppError(404, "Medication not found");
    throw new AppError(500, error.message);
  }
  return data;
}

export async function deleteMedication(medicationId: string, petId: string, ownerId: string) {
  await assertPetOwnership(petId, ownerId);
  const { error, count } = await supabaseAdmin
    .from("medications")
    .delete({ count: "exact" })
    .eq("id", medicationId)
    .eq("pet_id", petId);
  if (error) throw new AppError(500, error.message);
  if (count === 0) throw new AppError(404, "Medication not found");
}
