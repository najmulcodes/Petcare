import { supabaseAdmin } from "../../lib/supabase";
import { AppError } from "../../middleware/errorHandler";
import { assertPetOwnership } from "../../helpers/assertOwnership";
import { CreatePetExpenseInput, UpdatePetExpenseInput, PetExpenseQueryInput } from "./pet-expenses.schema";
import { buildMonthRange } from "../../helpers/dateUtils";

export async function getPetExpenses(petId: string, ownerId: string, query: PetExpenseQueryInput) {
  await assertPetOwnership(petId, ownerId);
  let builder = supabaseAdmin
    .from("pet_expenses")
    .select("*")
    .eq("pet_id", petId)
    .eq("owner_id", ownerId)
    .order("date", { ascending: false });

  if (query.month) {
    const { from, to } = buildMonthRange(query.month);
    builder = builder.gte("date", from).lt("date", to);
  }

  const { data, error } = await builder;
  if (error) throw new AppError(500, error.message);
  return data;
}

export async function createPetExpense(petId: string, ownerId: string, input: CreatePetExpenseInput) {
  await assertPetOwnership(petId, ownerId);
  const { data, error } = await supabaseAdmin
    .from("pet_expenses")
    .insert({
      pet_id: petId,
      owner_id: ownerId,
      date: input.date,
      category: input.category,
      amount_bdt: input.amount_bdt,
      notes: input.notes ?? null,
    })
    .select()
    .single();
  if (error) throw new AppError(500, error.message);
  return data;
}

export async function updatePetExpense(expenseId: string, petId: string, ownerId: string, input: UpdatePetExpenseInput) {
  await assertPetOwnership(petId, ownerId);
  const patch: Record<string, unknown> = {};
  if (input.date !== undefined) patch.date = input.date;
  if (input.category !== undefined) patch.category = input.category;
  if (input.amount_bdt !== undefined) patch.amount_bdt = input.amount_bdt;
  if (input.notes !== undefined) patch.notes = input.notes;
  if (Object.keys(patch).length === 0) throw new AppError(400, "No fields provided to update");

  const { data, error } = await supabaseAdmin
    .from("pet_expenses")
    .update(patch)
    .eq("id", expenseId)
    .eq("pet_id", petId)
    .eq("owner_id", ownerId)
    .select()
    .single();
  if (error) {
    if (error.code === "PGRST116") throw new AppError(404, "Expense not found");
    throw new AppError(500, error.message);
  }
  return data;
}

export async function deletePetExpense(expenseId: string, petId: string, ownerId: string) {
  await assertPetOwnership(petId, ownerId);
  const { error, count } = await supabaseAdmin
    .from("pet_expenses")
    .delete({ count: "exact" })
    .eq("id", expenseId)
    .eq("pet_id", petId)
    .eq("owner_id", ownerId);
  if (error) throw new AppError(500, error.message);
  if (count === 0) throw new AppError(404, "Expense not found");
}
