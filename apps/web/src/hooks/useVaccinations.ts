import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface Vaccination {
  id: string;
  pet_id: string;
  vaccine_name: string;
  administered_at: string;
  next_due_at: string | null;
  notes: string | null;
  created_at: string;
}

export interface CreateVaccinationInput {
  vaccine_name: string;
  administered_at: string;
  next_due_at?: string;
  notes?: string;
}

async function fetchVaccinations(petId: string): Promise<Vaccination[]> {
  const res = await api.get<{ success: boolean; data: Vaccination[] }>(`/pets/${petId}/vaccinations`);
  return res.data.data;
}

async function createVaccination({ petId, ...input }: CreateVaccinationInput & { petId: string }): Promise<Vaccination> {
  const res = await api.post<{ success: boolean; data: Vaccination }>(`/pets/${petId}/vaccinations`, input);
  return res.data.data;
}

async function deleteVaccination({ petId, id }: { petId: string; id: string }): Promise<void> {
  await api.delete(`/pets/${petId}/vaccinations/${id}`);
}

export function useVaccinations(petId: string) {
  return useQuery({
    queryKey: ["vaccinations", petId],
    queryFn: () => fetchVaccinations(petId),
    enabled: !!petId,
  });
}

export function useCreateVaccination(petId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateVaccinationInput) => createVaccination({ petId, ...input }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vaccinations", petId] }),
  });
}

export function useDeleteVaccination(petId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteVaccination({ petId, id }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vaccinations", petId] }),
  });
}
