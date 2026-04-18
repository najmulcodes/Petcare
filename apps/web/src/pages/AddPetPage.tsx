import { useState, FormEvent, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCreatePet } from "../../hooks/usePets";
import { uploadImage } from "../../lib/cloudinary";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { InlineError } from "../../components/ui/ErrorState";

const PET_FALLBACK = "🐶";

export function AddPetPage() {
  const navigate = useNavigate();
  const createPet = useCreatePet();
  const [form, setForm] = useState({ name: "", dob: "", breed: "", color: "", gender: "", notes: "" });
  const [error, setError] = useState<string | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function set(field: string, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    let imageUrl: string | undefined;

    if (imageFile) {
      try {
        setUploading(true);
        imageUrl = await uploadImage(imageFile);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Image upload failed");
        setUploading(false);
        return;
      } finally {
        setUploading(false);
      }
    }

    createPet.mutate(
      {
        name: form.name,
        dob: form.dob || undefined,
        breed: form.breed || undefined,
        color: form.color || undefined,
        gender: (form.gender as "male" | "female" | "unknown") || undefined,
        notes: form.notes || undefined,
        image: imageUrl,
      },
      {
        onSuccess: () => navigate("/pets"),
        onError: (err) => setError(err instanceof Error ? err.message : "Failed to create pet"),
      }
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-5">
      <div className="flex items-center gap-3">
        <Link to="/pets" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">← Back</Link>
        <h1 className="text-xl font-bold text-gray-900">Add new pet 🐾</h1>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-soft">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image upload */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Photo</label>
            <div className="flex items-center gap-4">
              <div
                className="flex h-16 w-16 flex-shrink-0 cursor-pointer items-center justify-center rounded-2xl bg-[#fff4f1] overflow-hidden text-3xl"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  PET_FALLBACK
                )}
              </div>
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-xl border border-[#eeddd3] bg-[#f6eee9] px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-[#eeddd3] transition-colors text-left"
                >
                  {imageFile ? "Change photo" : "Upload photo"}
                </button>
                {imageFile && (
                  <button
                    type="button"
                    onClick={() => { setImageFile(null); setImagePreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                    className="text-xs text-red-400 hover:text-red-600 text-left"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <Input label="Name *" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Milo" required />
          <Input label="Date of birth" type="date" value={form.dob} onChange={(e) => set("dob", e.target.value)} />
          <Input label="Breed" value={form.breed} onChange={(e) => set("breed", e.target.value)} placeholder="e.g. Labrador" />
          <Input label="Color" value={form.color} onChange={(e) => set("color", e.target.value)} placeholder="e.g. Golden" />
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
              placeholder="Any additional notes..."
              className="w-full rounded-2xl border border-[#eeddd3] bg-[#f6eee9] px-4 py-3 text-sm text-gray-800 placeholder-gray-300 outline-none transition-all focus:border-[#ff7a5c] focus:ring-2 focus:ring-[#ff7a5c]/15 resize-none"
            />
          </div>

          {error && <InlineError message={error} />}

          <div className="flex gap-3 pt-1">
            <Link to="/pets" className="flex-1">
              <button
                type="button"
                className="w-full rounded-2xl border border-[#eeddd3] bg-[#f6eee9] py-3 text-sm font-semibold text-gray-600 hover:bg-[#eeddd3] transition-colors"
              >
                Cancel
              </button>
            </Link>
            <Button type="submit" loading={uploading || createPet.isPending} className="flex-1">
              Add pet
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}