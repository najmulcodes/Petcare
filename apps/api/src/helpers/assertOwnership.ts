import { supabaseAdmin } from "../lib/supabase";
import { AppError } from "../middleware/errorHandler";

/**
 * Verifies that the given pet exists and belongs to ownerId.
 * Throws AppError(404) if the pet is not found or is owned by someone else.
 * Import this in every sub-resource service instead of duplicating the check.
 */
export async function assertPetOwnership(
  petId: string,
  ownerId: string
): Promise<void> {
  const { data, error } = await supabaseAdmin
    .from("pets")
    .select("id")
    .eq("id", petId)
    .eq("owner_id", ownerId)
    .single();

  if (error || !data) {
    throw new AppError(404, "Pet not found");
  }
}
