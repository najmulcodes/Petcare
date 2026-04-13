import { useState, FormEvent, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { usePet, useUpdatePet } from "../../hooks/usePets";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { PageSpinner } from "../../components/ui/Spinner";
import { InlineError, ErrorState } from "../../components/ui/ErrorState";

export function EditPetPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: pet, isLoading, error } = usePet(id!);
  const updatePet = useUpdatePet();
  const [form, setForm] = useState({ name: "", dob: "", breed: "", color: "", gender: "", notes: "" });
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (pet) {
      setForm({
        name: pet.name,
        dob: pet.dob ?? "",
        breed: pet.breed ?? "",
        color: pet.color ?? "",
        gender: pet.gender ?? "",
        notes: pet.notes ?? "",
      });
    }
  }, [pet]);

  if (isLoading) return <PageSpinner />;
  if (error || !pet) return <ErrorState title="Pet not found" message="This pet could not be loaded." />;

  function set(field: string, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    updatePet.mutate(
      {
        id: id!,
        name: form.name,
        dob: form.dob || undefined,
        breed: form.breed || undefined,
        color: form.color || undefined,
        gender: (form.gender as "male" | "female" | "unknown") || undefined,
        notes: form.notes || undefined,
      },
      {
        onSuccess: () => navigate(`/pets/${id}`),
        onError: (err) => setFormError(err instanceof Error ? err.message : "Failed to update pet"),
      }
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-5">
      <div className="flex items-center gap-3">
        <Link to={`/pets/${id}`} className="text-sm text-gray-400 hover:text-gray-700 transition-colors">← Back</Link>
        <h1 className="text-xl font-bold text-gray-900">Edit {pet.name}</h1>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-soft">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name *" value={form.name} onChange={(e) => set("name", e.target.value)} required />
          <Input label="Date of birth" type="date" value={form.dob} onChange={(e) => set("dob", e.target.value)} />
          <Input label="Breed" value={form.breed} onChange={(e) => set("breed", e.target.value)} />
          <Input label="Color" value={form.color} onChange={(e) => set("color", e.target.value)} />
          <Select
            label="Gender"
            value={form.gender}
            onChange={(e) => set("gender", e.target.value)}
            placeholder="Select gender"
            options={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "unknown", label: "Unknown" },
            ]}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              rows={3}
              className="w-full rounded-2xl border border-[#eeddd3] bg-[#f6eee9] px-4 py-3 text-sm text-gray-800 placeholder-gray-300 outline-none transition-all focus:border-[#ff7a5c] focus:ring-2 focus:ring-[#ff7a5c]/15 resize-none"
            />
          </div>

          {formError && <InlineError message={formError} />}

          <div className="flex gap-3 pt-1">
            <Link to={`/pets/${id}`} className="flex-1">
              <button
                type="button"
                className="w-full rounded-2xl border border-[#eeddd3] bg-[#f6eee9] py-3 text-sm font-semibold text-gray-600 hover:bg-[#eeddd3] transition-colors"
              >
                Cancel
              </button>
            </Link>
            <Button type="submit" loading={updatePet.isPending} className="flex-1">
              Save changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
