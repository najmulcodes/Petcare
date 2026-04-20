import { useState, FormEvent, useRef, ChangeEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCreatePet } from "../../hooks/usePets";
import { uploadImage } from "../../lib/cloudinary";
import { ImageCropper } from "../../components/ImageCropper";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { InlineError } from "../../components/ui/ErrorState";
import { EntityAvatar } from "../../components/ui/EntityAvatar";
import { FoodTimeInput } from "../../components/FoodTimeInput";

export function AddPetPage() {
  const navigate = useNavigate();
  const createPet = useCreatePet();
  const [form, setForm] = useState({ name: "", dob: "", breed: "", color: "", gender: "", notes: "" });
  const [foodTime, setFoodTime] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function set(field: string, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;

    setCropSrc(URL.createObjectURL(file));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleCropDone(file: File) {
    setCropSrc(null);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    let imageUrl: string | undefined;

    if (imageFile) {
      try {
        setUploading(true);
        imageUrl = await uploadImage(imageFile);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Image upload failed");
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
        food_time: foodTime || null,
      },
      {
        onSuccess: () => navigate("/pets"),
        onError: (error) => setError(error instanceof Error ? error.message : "Failed to create pet"),
      }
    );
  }

  return (
    <div className="space-y-6">
      {cropSrc && <ImageCropper imageSrc={cropSrc} onDone={handleCropDone} onCancel={() => setCropSrc(null)} />}

      <div className="flex items-center justify-between gap-4">
        <div>
          <Link to="/pets" className="text-sm font-medium text-[#8c776f] transition-colors hover:text-[#5f4d46]">
            ← Back to pets
          </Link>
          <h1 className="mt-2 text-3xl font-semibold text-[#221a16]">Add a new pet</h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-[#7e6d66]">
            Start with the basics now. You can always return later to add more history, vaccines, and notes.
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(18rem,0.8fr)_minmax(0,1.2fr)]">
        <section className="app-panel p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b28d80]">Photo</p>
          <h2 className="mt-2 text-xl font-semibold text-[#221a16]">Set the pet image</h2>
          <p className="mt-2 text-sm leading-7 text-[#7e6d66]">
            Upload a photo and crop it once so it fills cards, avatars, and detail pages cleanly.
          </p>

          <div className="mt-6 flex flex-col items-start gap-5 sm:flex-row sm:items-center xl:flex-col xl:items-start">
            <button type="button" onClick={() => fileInputRef.current?.click()} className="group">
              <EntityAvatar
                src={imagePreview}
                name={form.name || "Pet"}
                kind="pet"
                className="h-32 w-32 rounded-[28px] border border-[#f1e3da]"
                textClassName="text-2xl"
              />
              <span className="mt-3 block text-sm font-semibold text-[#5f4d46]">
                {imageFile ? "Replace photo" : "Upload photo"}
              </span>
            </button>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-2xl border border-warm-200 bg-[#fff8f4] px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-white"
              >
                {imageFile ? "Choose a different image" : "Choose an image"}
              </button>
              {imageFile && (
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="block text-sm font-semibold text-red-500 transition-colors hover:text-red-600"
                >
                  Remove photo
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
        </section>

        <section className="app-panel p-5 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Name *" value={form.name} onChange={(event) => set("name", event.target.value)} placeholder="Milo" required />
              <Input label="Date of birth" type="date" value={form.dob} onChange={(event) => set("dob", event.target.value)} />
              <Input label="Breed" value={form.breed} onChange={(event) => set("breed", event.target.value)} placeholder="Labrador" />
              <Input label="Color" value={form.color} onChange={(event) => set("color", event.target.value)} placeholder="Golden" />
            </div>

            <Select
              label="Gender"
              value={form.gender}
              onChange={(event) => set("gender", event.target.value)}
              placeholder="Select gender"
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "unknown", label: "Unknown" },
              ]}
            />

            <FoodTimeInput value={foodTime} onChange={setFoodTime} />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Notes</label>
              <textarea
                value={form.notes}
                onChange={(event) => set("notes", event.target.value)}
                rows={5}
                placeholder="Add anything useful for future reference."
                className="w-full rounded-2xl border border-[#eeddd3] bg-[#f6eee9] px-4 py-3.5 text-sm text-gray-800 placeholder-gray-300 outline-none transition-all focus:border-[#ff7a5c] focus:ring-2 focus:ring-[#ff7a5c]/15 resize-none"
              />
            </div>

            {error && <InlineError message={error} />}

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <Link to="/pets" className="sm:min-w-[9rem]">
                <button
                  type="button"
                  className="w-full rounded-2xl border border-[#eeddd3] bg-[#f6eee9] py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-[#eeddd3]"
                >
                  Cancel
                </button>
              </Link>
              <Button type="submit" loading={uploading || createPet.isPending} className="sm:min-w-[12rem]">
                Create pet profile
              </Button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
