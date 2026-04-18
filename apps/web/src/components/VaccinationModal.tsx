import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Modal } from "./ui/Modal";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { InlineError } from "./ui/ErrorState";
import {
  CreateVaccinationInput,
  Vaccination,
  useCreateVaccination,
  useUpdateVaccination,
} from "../hooks/useVaccinations";
import { uploadImage } from "../lib/cloudinary";
import { scanVaccinationCard } from "../lib/vaccineCardScanner";

interface VaccinationModalProps {
  open: boolean;
  onClose: () => void;
  petId: string;
  vaccination?: Vaccination | null;
}

type FormState = {
  vaccine_name: string;
  administered_at: string;
  next_due_at: string;
  notes: string;
};

const EMPTY_FORM: FormState = {
  vaccine_name: "",
  administered_at: "",
  next_due_at: "",
  notes: "",
};

async function fileFromUrl(url: string): Promise<File> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], "vaccination-card.jpg", { type: blob.type || "image/jpeg" });
}

export function VaccinationModal({ open, onClose, petId, vaccination }: VaccinationModalProps) {
  const createVaccination = useCreateVaccination(petId);
  const updateVaccination = useUpdateVaccination(petId);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditing = Boolean(vaccination);

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [scanStatus, setScanStatus] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [savingImage, setSavingImage] = useState(false);

  const busy = createVaccination.isPending || updateVaccination.isPending || savingImage;

  useEffect(() => {
    if (!open) return;

    setForm(
      vaccination
        ? {
            vaccine_name: vaccination.vaccine_name,
            administered_at: vaccination.administered_at,
            next_due_at: vaccination.next_due_at ?? "",
            notes: vaccination.notes ?? "",
          }
        : EMPTY_FORM
    );
    setImageFile(null);
    setImagePreview(vaccination?.card_image_url ?? null);
    setOcrText(vaccination?.ocr_text ?? "");
    setError(null);
    setScanError(null);
    setScanStatus(null);
  }, [open, vaccination]);

  const title = useMemo(() => (isEditing ? "Edit vaccination" : "Add vaccination"), [isEditing]);

  function set(field: keyof FormState, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setScanError(null);
    setScanStatus(null);

    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleScan() {
    setScanError(null);
    setScanStatus("Preparing image...");

    try {
      const targetFile = imageFile ?? (imagePreview ? await fileFromUrl(imagePreview) : null);

      if (!targetFile) {
        setScanError("Upload a vaccine card image before scanning.");
        setScanStatus(null);
        return;
      }

      const result = await scanVaccinationCard(targetFile, (message) => setScanStatus(message));

      setOcrText(result.extractedText.slice(0, 12000));
      setForm((previous) => ({
        vaccine_name: result.fields.vaccine_name || previous.vaccine_name,
        administered_at: result.fields.administered_at || previous.administered_at,
        next_due_at: result.fields.next_due_at || previous.next_due_at,
        notes: previous.notes,
      }));

      setScanStatus(
        result.confidence > 0
          ? `Scan complete (${Math.round(result.confidence)}% confidence). Review the fields before saving.`
          : "Scan complete. Review the fields before saving."
      );
    } catch (error) {
      setScanStatus(null);
      setScanError(error instanceof Error ? error.message : "Unable to scan this card image.");
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    let cardImageUrl = vaccination?.card_image_url ?? undefined;

    if (imageFile) {
      try {
        setSavingImage(true);
        cardImageUrl = await uploadImage(imageFile);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Image upload failed");
        setSavingImage(false);
        return;
      } finally {
        setSavingImage(false);
      }
    }

    const payload: CreateVaccinationInput = {
      vaccine_name: form.vaccine_name,
      administered_at: form.administered_at,
      next_due_at: form.next_due_at || undefined,
      notes: form.notes || undefined,
      card_image_url: cardImageUrl,
      ocr_text: ocrText || undefined,
    };

    if (isEditing && vaccination) {
      updateVaccination.mutate(
        { id: vaccination.id, ...payload },
        {
          onSuccess: () => onClose(),
          onError: (error) => setError(error instanceof Error ? error.message : "Failed to update vaccination"),
        }
      );
      return;
    }

    createVaccination.mutate(payload, {
      onSuccess: () => onClose(),
      onError: (error) => setError(error instanceof Error ? error.message : "Failed to save vaccination"),
    });
  }

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-[24px] border border-[#f1e3da] bg-[#fff8f4] p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#221a16]">Vaccine card photo</p>
              <p className="mt-1 text-sm leading-7 text-[#7e6d66]">
                Upload the card image, scan what we can, then keep manual edits in control.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:items-end">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-2xl border border-warm-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-[#fffdfb]"
              >
                {imagePreview ? "Replace image" : "Upload image"}
              </button>
              <button
                type="button"
                onClick={handleScan}
                className="rounded-2xl px-4 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.01]"
                style={{ background: "#ff7a5c" }}
              >
                Scan from card
              </button>
            </div>
          </div>

          {imagePreview && (
            <div className="mt-4 overflow-hidden rounded-[22px] border border-[#ead9cf] bg-white">
              <img src={imagePreview} alt="Vaccination card preview" className="h-48 w-full object-cover" />
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {scanStatus && (
            <p className="mt-4 rounded-2xl border border-[#f1e3da] bg-white px-4 py-3 text-sm text-[#5f4d46]">
              {scanStatus}
            </p>
          )}
          {scanError && <div className="mt-4"><InlineError message={scanError} /></div>}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Vaccine name *"
            value={form.vaccine_name}
            onChange={(event) => set("vaccine_name", event.target.value)}
            placeholder="Rabies"
            required
          />
          <Input
            label="Date administered *"
            type="date"
            value={form.administered_at}
            onChange={(event) => set("administered_at", event.target.value)}
            required
          />
          <Input
            label="Next due date"
            type="date"
            value={form.next_due_at}
            onChange={(event) => set("next_due_at", event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Notes</label>
          <textarea
            value={form.notes}
            onChange={(event) => set("notes", event.target.value)}
            rows={4}
            placeholder="Add any clinic, dosage, or follow-up notes."
            className="w-full rounded-2xl border border-[#eeddd3] bg-[#f6eee9] px-4 py-3.5 text-sm text-gray-800 placeholder-gray-300 outline-none transition-all focus:border-[#ff7a5c] focus:ring-2 focus:ring-[#ff7a5c]/15 resize-none"
          />
        </div>

        {ocrText && (
          <div className="rounded-[24px] border border-[#f1e3da] bg-[#fff8f4] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b28d80]">Scanned text</p>
            <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-[#5f4d46]">{ocrText}</p>
          </div>
        )}

        {error && <InlineError message={error} />}

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl border border-[#eeddd3] bg-[#f6eee9] py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-[#eeddd3]"
          >
            Cancel
          </button>
          <Button type="submit" loading={busy} className="flex-1">
            {isEditing ? "Save vaccination" : "Add vaccination"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
