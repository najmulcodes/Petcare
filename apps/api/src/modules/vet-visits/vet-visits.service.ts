import { supabaseAdmin } from "../../lib/supabase";
import { AppError } from "../../middleware/errorHandler";
import { assertPetOwnership } from "../../helpers/assertOwnership";
import { CreateVetVisitInput, UpdateVetVisitInput } from "./vet-visits.schema";

export async function getVetVisits(petId: string, ownerId: string) {
  await assertPetOwnership(petId, ownerId);
  const { data, error } = await supabaseAdmin
    .from("vet_visits")
    .select("*")
    .eq("pet_id", petId)
    .order("visit_date", { ascending: false });
  if (error) throw new AppError(500, error.message);
  return data;
}

export async function getVetVisitById(visitId: string, petId: string, ownerId: string) {
  await assertPetOwnership(petId, ownerId);
  const { data, error } = await supabaseAdmin
    .from("vet_visits")
    .select("*")
    .eq("id", visitId)
    .eq("pet_id", petId)
    .single();
  if (error) {
    if (error.code === "PGRST116") throw new AppError(404, "Vet visit not found");
    throw new AppError(500, error.message);
  }
  return data;
}

export async function createVetVisit(petId: string, ownerId: string, input: CreateVetVisitInput) {
  await assertPetOwnership(petId, ownerId);
  const { data, error } = await supabaseAdmin
    .from("vet_visits")
    .insert({
      pet_id: petId,
      visit_date: input.visit_date,
      reason: input.reason,
      vet_name: input.vet_name ?? null,
      notes: input.notes ?? null,
      cost_bdt: input.cost_bdt ?? null,
    })
    .select()
    .single();
  if (error) throw new AppError(500, error.message);
  return data;
}

export async function updateVetVisit(visitId: string, petId: string, ownerId: string, input: UpdateVetVisitInput) {
  await assertPetOwnership(petId, ownerId);
  const patch: Record<string, unknown> = {};
  if (input.visit_date !== undefined) patch.visit_date = input.visit_date;
  if (input.reason !== undefined) patch.reason = input.reason;
  if (input.vet_name !== undefined) patch.vet_name = input.vet_name;
  if (input.notes !== undefined) patch.notes = input.notes;
  if (input.cost_bdt !== undefined) patch.cost_bdt = input.cost_bdt;
  if (Object.keys(patch).length === 0) throw new AppError(400, "No fields provided to update");

  const { data, error } = await supabaseAdmin
    .from("vet_visits")
    .update(patch)
    .eq("id", visitId)
    .eq("pet_id", petId)
    .select()
    .single();
  if (error) {
    if (error.code === "PGRST116") throw new AppError(404, "Vet visit not found");
    throw new AppError(500, error.message);
  }
  return data;
}

export async function deleteVetVisit(visitId: string, petId: string, ownerId: string) {
  await assertPetOwnership(petId, ownerId);
  const { error, count } = await supabaseAdmin
    .from("vet_visits")
    .delete({ count: "exact" })
    .eq("id", visitId)
    .eq("pet_id", petId);
  if (error) throw new AppError(500, error.message);
  if (count === 0) throw new AppError(404, "Vet visit not found");
}
