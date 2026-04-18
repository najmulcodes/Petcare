import { useState, FormEvent } from "react";
import { useParams, Link } from "react-router-dom";
import { usePet } from "../../hooks/usePets";
import {
  useMedications,
  useCreateMedication,
  useDeleteMedication,
  useToggleMedication,
} from "../../hooks/useMedications";
import { useVaccinations, useDeleteVaccination, Vaccination } from "../../hooks/useVaccinations";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Modal } from "../../components/ui/Modal";
import { PageSpinner, Spinner } from "../../components/ui/Spinner";
import { ErrorState, InlineError } from "../../components/ui/ErrorState";
import { EntityAvatar } from "../../components/ui/EntityAvatar";
import { VaccinationModal } from "../../components/VaccinationModal";

function calcAge(dob: string | null): string {
  if (!dob) return "Unknown";

  const birth = new Date(dob);
  const now = new Date();
  const totalMonths =
    (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());

  if (totalMonths < 1) return "Under 1 month";
  if (totalMonths < 12) return `${totalMonths} months`;

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  return months > 0 ? `${years}y ${months}m` : `${years} years`;
}

function AddMedicationModal({ petId, open, onClose }: { petId: string; open: boolean; onClose: () => void }) {
  const createMedication = useCreateMedication(petId);
  const [form, setForm] = useState({ name: "", dosage: "", frequency: "daily", start_date: "", end_date: "" });
  const [error, setError] = useState<string | null>(null);
  const stickyFooterClass =
    "sticky bottom-0 -mx-5 mt-2 flex flex-col-reverse gap-3 bg-white px-5 pt-4 pb-6 pb-[calc(env(safe-area-inset-bottom)+24px)] sm:-mx-6 sm:flex-row sm:px-6 sm:pb-6";

  function set(field: string, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    createMedication.mutate(
      {
        name: form.name,
        dosage: form.dosage,
        frequency: form.frequency as "daily" | "weekly" | "custom",
        start_date: form.start_date,
        end_date: form.end_date || undefined,
        is_active: true,
      },
      {
        onSuccess: () => {
          onClose();
          setForm({ name: "", dosage: "", frequency: "daily", start_date: "", end_date: "" });
        },
        onError: (error) => setError(error instanceof Error ? error.message : "Failed to add medication"),
      }
    );
  }

  return (
    <Modal open={open} onClose={onClose} title="Add medication">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Medicine name *" value={form.name} onChange={(event) => set("name", event.target.value)} placeholder="Amoxicillin" required />
        <Input label="Dosage *" value={form.dosage} onChange={(event) => set("dosage", event.target.value)} placeholder="250mg twice daily" required />
        <Select
          label="Frequency *"
          value={form.frequency}
          onChange={(event) => set("frequency", event.target.value)}
          options={[
            { value: "daily", label: "Daily" },
            { value: "weekly", label: "Weekly" },
            { value: "custom", label: "Custom" },
          ]}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Start date *" type="date" value={form.start_date} onChange={(event) => set("start_date", event.target.value)} required />
          <Input label="End date" type="date" value={form.end_date} onChange={(event) => set("end_date", event.target.value)} />
        </div>
        {error && <InlineError message={error} />}
        <div className={stickyFooterClass}>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl border border-[#eeddd3] bg-[#f6eee9] py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-[#eeddd3]"
          >
            Cancel
          </button>
          <Button type="submit" loading={createMedication.isPending} className="flex-1">
            Add medication
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function MedicationsSection({ petId }: { petId: string }) {
  const { data: medications, isLoading, error, refetch } = useMedications(petId);
  const deleteMedication = useDeleteMedication(petId);
  const toggleMedication = useToggleMedication(petId);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <>
      <section className="app-panel p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b28d80]">Medication</p>
            <h2 className="mt-1 text-xl font-semibold text-[#221a16]">Current routines</h2>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="rounded-2xl px-4 py-2 text-sm font-semibold text-white"
            style={{ background: "#ff7a5c" }}
          >
            Add
          </button>
        </div>

        {isLoading && <div className="flex justify-center py-4"><Spinner className="h-5 w-5" /></div>}
        {error && <ErrorState message="Failed to load medications." onRetry={() => refetch()} />}

        {!isLoading && !error && (!medications || medications.length === 0) && (
          <div className="rounded-[24px] bg-[#fff8f4] px-5 py-8 text-center">
            <p className="text-lg font-semibold text-[#221a16]">No medications recorded</p>
            <p className="mt-2 text-sm leading-7 text-[#7e6d66]">Add an active medication to track dosage, frequency, and dates.</p>
          </div>
        )}

        {medications && medications.length > 0 && (
          <div className="space-y-3">
            {medications.map((medication) => (
              <div
                key={medication.id}
                className="rounded-[24px] border border-[#f1e3da] bg-[#fffaf7] px-4 py-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-[#221a16]">{medication.name}</p>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          medication.is_active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {medication.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-[#7e6d66]">{medication.dosage}</p>
                    <p className="mt-1 text-sm text-[#8c776f]">
                      {medication.frequency} · {medication.start_date}{medication.end_date ? ` to ${medication.end_date}` : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => toggleMedication.mutate({ id: medication.id, is_active: !medication.is_active })}
                      className="rounded-2xl border border-warm-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-[#fffdfb]"
                    >
                      {medication.is_active ? "Pause" : "Resume"}
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Delete this medication?")) deleteMedication.mutate(medication.id);
                      }}
                      className="rounded-2xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-500 transition-colors hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <AddMedicationModal petId={petId} open={showAdd} onClose={() => setShowAdd(false)} />
    </>
  );
}

function VaccinationsSection({ petId }: { petId: string }) {
  const { data: vaccinations, isLoading, error, refetch } = useVaccinations(petId);
  const deleteVaccination = useDeleteVaccination(petId);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVaccination, setSelectedVaccination] = useState<Vaccination | null>(null);

  function openAddModal() {
    setSelectedVaccination(null);
    setModalOpen(true);
  }

  function openEditModal(vaccination: Vaccination) {
    setSelectedVaccination(vaccination);
    setModalOpen(true);
  }

  function isDueSoon(nextDue: string | null): boolean {
    if (!nextDue) return false;
    const dueDate = new Date(nextDue);
    const now = new Date();
    const diff = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 14;
  }

  return (
    <>
      <section className="app-panel p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b28d80]">Vaccinations</p>
            <h2 className="mt-1 text-xl font-semibold text-[#221a16]">Records and due dates</h2>
          </div>
          <button
            onClick={openAddModal}
            className="rounded-2xl px-4 py-2 text-sm font-semibold text-white"
            style={{ background: "#ff7a5c" }}
          >
            Add
          </button>
        </div>

        {isLoading && <div className="flex justify-center py-4"><Spinner className="h-5 w-5" /></div>}
        {error && <ErrorState message="Failed to load vaccinations." onRetry={() => refetch()} />}

        {!isLoading && !error && (!vaccinations || vaccinations.length === 0) && (
          <div className="rounded-[24px] bg-[#fff8f4] px-5 py-8 text-center">
            <p className="text-lg font-semibold text-[#221a16]">No vaccinations recorded</p>
            <p className="mt-2 text-sm leading-7 text-[#7e6d66]">
              Add a record manually or upload a vaccine card image and scan it before saving.
            </p>
          </div>
        )}

        {vaccinations && vaccinations.length > 0 && (
          <div className="space-y-3">
            {vaccinations.map((vaccination) => (
              <div
                key={vaccination.id}
                className="rounded-[24px] border border-[#f1e3da] bg-[#fffaf7] px-4 py-4"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-[#221a16]">{vaccination.vaccine_name}</p>
                      {isDueSoon(vaccination.next_due_at) && (
                        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                          Due soon
                        </span>
                      )}
                      {vaccination.card_image_url && (
                        <span className="rounded-full bg-[#fff4f1] px-2.5 py-1 text-[11px] font-semibold text-[#ff7a5c]">
                          Card image attached
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-[#7e6d66]">Given on {vaccination.administered_at}</p>
                    {vaccination.next_due_at && (
                      <p className="mt-1 text-sm text-[#8c776f]">Next due {vaccination.next_due_at}</p>
                    )}
                    {vaccination.notes && (
                      <p className="mt-3 rounded-2xl bg-[#fff8f4] px-4 py-3 text-sm leading-7 text-[#7e6d66]">
                        {vaccination.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => openEditModal(vaccination)}
                      className="rounded-2xl border border-warm-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-[#fffdfb]"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Delete this vaccination record?")) deleteVaccination.mutate(vaccination.id);
                      }}
                      className="rounded-2xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-500 transition-colors hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <VaccinationModal
        petId={petId}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedVaccination(null);
        }}
        vaccination={selectedVaccination}
      />
    </>
  );
}

export function PetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: pet, isLoading, error } = usePet(id!);

  if (isLoading) return <PageSpinner />;
  if (error || !pet) {
    return (
      <ErrorState
        title="Pet not found"
        message="This pet could not be loaded."
        action={
          <Link to="/pets">
            <button className="rounded-2xl border border-[#eeddd3] bg-white px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-[#f6eee9]">
              Back to pets
            </button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link to="/pets" className="text-sm font-medium text-[#8c776f] transition-colors hover:text-[#5f4d46]">
            ← All pets
          </Link>
          <h1 className="mt-2 text-3xl font-semibold text-[#221a16]">{pet.name}</h1>
        </div>
        <Link to={`/pets/${id}/edit`}>
          <button className="rounded-2xl border border-warm-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-[#fffdfb]">
            Edit profile
          </button>
        </Link>
      </div>

      <section className="overflow-hidden rounded-[32px] border border-white/70 bg-white/92 p-6 shadow-card sm:p-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(18rem,0.78fr)_minmax(0,1.22fr)] xl:items-center">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center xl:flex-col xl:items-start">
            <EntityAvatar
              src={pet.image}
              name={pet.name}
              kind="pet"
              className="h-28 w-28 rounded-[32px] border border-[#f1e3da]"
              textClassName="text-2xl"
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#b28d80]">Pet profile</p>
              <h2 className="mt-2 text-3xl font-semibold text-[#221a16]">{pet.name}</h2>
              <p className="mt-2 text-sm leading-7 text-[#7e6d66]">
                Keep care records, doses, and due dates attached to this pet profile so they stay easy to update later.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-[#fff4f1] px-3 py-1 text-xs font-semibold text-[#ff7a5c]">
                  {calcAge(pet.dob)}
                </span>
                {pet.gender && (
                  <span className="rounded-full bg-[#f0faf5] px-3 py-1 text-xs font-semibold capitalize text-emerald-700">
                    {pet.gender}
                  </span>
                )}
                {pet.breed && (
                  <span className="rounded-full bg-[#fff8f4] px-3 py-1 text-xs font-semibold text-[#8c776f]">
                    {pet.breed}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[24px] bg-[#fff8f4] px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b28d80]">Age</p>
              <p className="mt-2 text-sm font-semibold text-[#221a16]">{calcAge(pet.dob)}</p>
            </div>
            <div className="rounded-[24px] bg-[#fff8f4] px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b28d80]">Birthdate</p>
              <p className="mt-2 text-sm font-semibold text-[#221a16]">{pet.dob || "Not set"}</p>
            </div>
            <div className="rounded-[24px] bg-[#fff8f4] px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b28d80]">Color</p>
              <p className="mt-2 text-sm font-semibold text-[#221a16]">{pet.color || "Not set"}</p>
            </div>
            <div className="rounded-[24px] bg-[#fff8f4] px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b28d80]">Breed</p>
              <p className="mt-2 text-sm font-semibold text-[#221a16]">{pet.breed || "Not set"}</p>
            </div>
          </div>
        </div>

        {pet.notes && (
          <div className="mt-6 rounded-[24px] border border-[#f1e3da] bg-[#fff8f4] px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b28d80]">Notes</p>
            <p className="mt-3 text-sm leading-7 text-[#5f4d46]">{pet.notes}</p>
          </div>
        )}
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <MedicationsSection petId={id!} />
        <VaccinationsSection petId={id!} />
      </div>
    </div>
  );
}
