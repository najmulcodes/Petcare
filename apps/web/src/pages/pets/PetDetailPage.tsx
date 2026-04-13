import { useState, FormEvent } from "react";
import { useParams, Link } from "react-router-dom";
import { usePet } from "../../hooks/usePets";
import { useMedications, useCreateMedication, useDeleteMedication, useToggleMedication } from "../../hooks/useMedications";
import { useVaccinations, useCreateVaccination, useDeleteVaccination } from "../../hooks/useVaccinations";
import { Card, CardHeader, CardTitle } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Modal } from "../../components/ui/Modal";
import { PageSpinner, Spinner } from "../../components/ui/Spinner";
import { ErrorState, InlineError } from "../../components/ui/ErrorState";

function calcAge(dob: string | null): string {
  if (!dob) return "Unknown";
  const birth = new Date(dob);
  const now = new Date();
  const totalMonths =
    (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  if (totalMonths < 1) return "< 1 month";
  if (totalMonths < 12) return `${totalMonths} months`;
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  return months > 0 ? `${years}y ${months}m` : `${years} years`;
}

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex justify-between py-2 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900 capitalize">{value}</span>
    </div>
  );
}

// ─── Add Medication Modal ─────────────────────────────────────────────────────
function AddMedicationModal({ petId, open, onClose }: { petId: string; open: boolean; onClose: () => void }) {
  const createMedication = useCreateMedication(petId);
  const [form, setForm] = useState({ name: "", dosage: "", frequency: "daily", start_date: "", end_date: "" });
  const [error, setError] = useState<string | null>(null);

  function set(field: string, value: string) { setForm((p) => ({ ...p, [field]: value })); }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
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
        onSuccess: () => { onClose(); setForm({ name: "", dosage: "", frequency: "daily", start_date: "", end_date: "" }); },
        onError: (err) => setError(err instanceof Error ? err.message : "Failed to add medication"),
      }
    );
  }

  return (
    <Modal open={open} onClose={onClose} title="💊 Add Medication">
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input label="Medicine name *" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Amoxicillin" required />
        <Input label="Dosage *" value={form.dosage} onChange={(e) => set("dosage", e.target.value)} placeholder="e.g. 250mg twice daily" required />
        <Select
          label="Frequency *"
          value={form.frequency}
          onChange={(e) => set("frequency", e.target.value)}
          options={[
            { value: "daily", label: "Daily" },
            { value: "weekly", label: "Weekly" },
            { value: "custom", label: "Custom" },
          ]}
        />
        <Input label="Start date *" type="date" value={form.start_date} onChange={(e) => set("start_date", e.target.value)} required />
        <Input label="End date" type="date" value={form.end_date} onChange={(e) => set("end_date", e.target.value)} />
        {error && <InlineError message={error} />}
        <div className="flex gap-2 pt-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={createMedication.isPending} className="flex-1">Add</Button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Add Vaccination Modal ────────────────────────────────────────────────────
function AddVaccinationModal({ petId, open, onClose }: { petId: string; open: boolean; onClose: () => void }) {
  const createVaccination = useCreateVaccination(petId);
  const [form, setForm] = useState({ vaccine_name: "", administered_at: "", next_due_at: "", notes: "" });
  const [error, setError] = useState<string | null>(null);

  function set(field: string, value: string) { setForm((p) => ({ ...p, [field]: value })); }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    createVaccination.mutate(
      {
        vaccine_name: form.vaccine_name,
        administered_at: form.administered_at,
        next_due_at: form.next_due_at || undefined,
        notes: form.notes || undefined,
      },
      {
        onSuccess: () => { onClose(); setForm({ vaccine_name: "", administered_at: "", next_due_at: "", notes: "" }); },
        onError: (err) => setError(err instanceof Error ? err.message : "Failed to add vaccination"),
      }
    );
  }

  return (
    <Modal open={open} onClose={onClose} title="💉 Add Vaccination">
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input label="Vaccine name *" value={form.vaccine_name} onChange={(e) => set("vaccine_name", e.target.value)} placeholder="e.g. Rabies" required />
        <Input label="Date administered *" type="date" value={form.administered_at} onChange={(e) => set("administered_at", e.target.value)} required />
        <Input label="Next due date" type="date" value={form.next_due_at} onChange={(e) => set("next_due_at", e.target.value)} />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            rows={2}
            placeholder="Optional notes..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
        {error && <InlineError message={error} />}
        <div className="flex gap-2 pt-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={createVaccination.isPending} className="flex-1">Add</Button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Medications Section ──────────────────────────────────────────────────────
function MedicationsSection({ petId }: { petId: string }) {
  const { data: medications, isLoading, error, refetch } = useMedications(petId);
  const deleteMedication = useDeleteMedication(petId);
  const toggleMedication = useToggleMedication(petId);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>💊 Medications</CardTitle>
          <Button size="sm" onClick={() => setShowAdd(true)}>+ Add</Button>
        </CardHeader>

        {isLoading && <div className="flex justify-center py-4"><Spinner className="h-5 w-5" /></div>}
        {error && <ErrorState message="Failed to load medications." onRetry={() => refetch()} />}

        {!isLoading && !error && (!medications || medications.length === 0) && (
          <p className="py-4 text-center text-sm text-gray-400">No medications recorded.</p>
        )}

        {medications && medications.length > 0 && (
          <ul className="divide-y divide-gray-100">
            {medications.map((med) => (
              <li key={med.id} className="flex items-start justify-between py-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">{med.name}</p>
                    <Badge className={med.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}>
                      {med.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500">{med.dosage} · {med.frequency}</p>
                  <p className="text-xs text-gray-400">
                    {med.start_date}{med.end_date ? ` → ${med.end_date}` : ""}
                  </p>
                </div>
                <div className="ml-3 flex gap-1">
                  <button
                    onClick={() => toggleMedication.mutate({ id: med.id, is_active: !med.is_active })}
                    className="rounded px-2 py-1 text-xs text-brand-600 hover:bg-brand-50"
                  >
                    {med.is_active ? "Pause" : "Resume"}
                  </button>
                  <button
                    onClick={() => { if (confirm("Delete this medication?")) deleteMedication.mutate(med.id); }}
                    className="rounded px-2 py-1 text-xs text-red-500 hover:bg-red-50"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <AddMedicationModal petId={petId} open={showAdd} onClose={() => setShowAdd(false)} />
    </>
  );
}

// ─── Vaccinations Section ─────────────────────────────────────────────────────
function VaccinationsSection({ petId }: { petId: string }) {
  const { data: vaccinations, isLoading, error, refetch } = useVaccinations(petId);
  const deleteVaccination = useDeleteVaccination(petId);
  const [showAdd, setShowAdd] = useState(false);

  function isDueSoon(nextDue: string | null): boolean {
    if (!nextDue) return false;
    const due = new Date(nextDue);
    const now = new Date();
    const diff = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 14;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>💉 Vaccinations</CardTitle>
          <Button size="sm" onClick={() => setShowAdd(true)}>+ Add</Button>
        </CardHeader>

        {isLoading && <div className="flex justify-center py-4"><Spinner className="h-5 w-5" /></div>}
        {error && <ErrorState message="Failed to load vaccinations." onRetry={() => refetch()} />}

        {!isLoading && !error && (!vaccinations || vaccinations.length === 0) && (
          <p className="py-4 text-center text-sm text-gray-400">No vaccinations recorded.</p>
        )}

        {vaccinations && vaccinations.length > 0 && (
          <ul className="divide-y divide-gray-100">
            {vaccinations.map((vac) => (
              <li key={vac.id} className="flex items-start justify-between py-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">{vac.vaccine_name}</p>
                    {isDueSoon(vac.next_due_at) && (
                      <Badge className="bg-amber-100 text-amber-700">Due soon</Badge>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500">Given: {vac.administered_at}</p>
                  {vac.next_due_at && (
                    <p className="text-xs text-gray-400">Next due: {vac.next_due_at}</p>
                  )}
                  {vac.notes && <p className="mt-1 text-xs text-gray-400 italic">{vac.notes}</p>}
                </div>
                <button
                  onClick={() => { if (confirm("Delete this vaccination record?")) deleteVaccination.mutate(vac.id); }}
                  className="ml-3 rounded px-2 py-1 text-xs text-red-500 hover:bg-red-50"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <AddVaccinationModal petId={petId} open={showAdd} onClose={() => setShowAdd(false)} />
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function PetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: pet, isLoading, error } = usePet(id!);

  if (isLoading) return <PageSpinner />;
  if (error || !pet) {
    return (
      <ErrorState
        title="Pet not found"
        message="This pet could not be loaded."
        action={<Link to="/pets"><Button variant="secondary" size="sm">Back to pets</Button></Link>}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link to="/pets" className="text-sm text-gray-500 hover:text-gray-700">← All pets</Link>
        <Link to={`/pets/${id}/edit`}>
          <Button variant="secondary" size="sm">Edit</Button>
        </Link>
      </div>

      {/* Profile */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-brand-50 text-5xl">🐶</div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{pet.name}</h1>
            <div className="mt-1 flex flex-wrap gap-2">
              {pet.gender && <Badge className="capitalize">{pet.gender}</Badge>}
              {pet.breed && <Badge>{pet.breed}</Badge>}
              {pet.color && <Badge>{pet.color}</Badge>}
            </div>
          </div>
        </div>

        <div className="mt-4 divide-y divide-gray-100 rounded-lg border border-gray-100 bg-gray-50 px-4">
          <InfoRow label="Age" value={calcAge(pet.dob)} />
          <InfoRow label="Date of birth" value={pet.dob} />
          <InfoRow label="Breed" value={pet.breed} />
          <InfoRow label="Color" value={pet.color} />
        </div>

        {pet.notes && (
          <div className="mt-4 rounded-lg bg-yellow-50 p-3">
            <p className="text-xs font-medium text-yellow-700">Notes</p>
            <p className="mt-1 text-sm text-yellow-900">{pet.notes}</p>
          </div>
        )}
      </Card>

      {/* Health sections */}
      <MedicationsSection petId={id!} />
      <VaccinationsSection petId={id!} />
    </div>
  );
}
