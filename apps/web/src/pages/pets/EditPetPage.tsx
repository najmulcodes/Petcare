import { useState, FormEvent, useEffect, useRef, ChangeEvent } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { usePet, useUpdatePet } from "../../hooks/usePets";
import { uploadImage } from "../../lib/cloudinary";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { PageSpinner } from "../../components/ui/Spinner";
import { InlineError, ErrorState } from "../../components/ui/ErrorState";
import { ImageCropper } from "../../components/ImageCropper";
import { EntityAvatar } from "../../components/ui/EntityAvatar";

export function EditPetPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: pet, isLoading, error } = usePet(id!);
  const updatePet = useUpdatePet();
  const [form, setForm] = useState({ name: "", dob: "", breed: "", color: "", gender: "", notes: "" });
  const [formError, setFormError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!pet) return;

    setForm({
      name: pet.name,
      dob: pet.dob ?? "",
      breed: pet.breed ?? "",
      color: pet.color ?? "",
      gender: pet.gender ?? "",
      notes: pet.notes ?? "",
    });
    setImagePreview(pet.image ?? null);
  }, [pet]);

  if (isLoading) return <PageSpinner />;
  if (error || !pet) return <ErrorState title="Pet not found" message="This pet could not be loaded." />;

  const currentPet = pet;

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
    setFormError(null);

    let imageUrl: string | undefined = currentPet.image ?? undefined;

    if (imageFile) {
      try {
        setUploading(true);
        imageUrl = await uploadImage(imageFile);
      } catch (error) {
        setFormError(error instanceof Error ? error.message : "Image upload failed");
        setUploading(false);
        return;
      } finally {
        setUploading(false);
      }
    }

    updatePet.mutate(
      {
        id: id!,
        name: form.name,
        dob: form.dob || undefined,
        breed: form.breed || undefined,
        color: form.color || undefined,
        gender: (form.gender as "male" | "female" | "unknown") || undefined,
        notes: form.notes || undefined,
        image: imageUrl,
      },
      {
        onSuccess: () => navigate(`/pets/${id}`),
        onError: (error) => setFormError(error instanceof Error ? error.message : "Failed to update pet"),
      }
    );
  }

  return (
    <div className="space-y-6">
      {cropSrc && <ImageCropper imageSrc={cropSrc} onDone={handleCropDone} onCancel={() => setCropSrc(null)} />}

      <div className="flex items-center justify-between gap-4">
        <div>
          <Link to={`/pets/${id}`} className="text-sm font-medium text-[#8c776f] transition-colors hover:text-[#5f4d46]">
            ← Back to profile
          </Link>
          <h1 className="mt-2 text-3xl font-semibold text-[#221a16]">Edit {pet.name}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-[#7e6d66]">
            Refresh the profile details and image so your records stay easy to scan everywhere in the app.
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(18rem,0.8fr)_minmax(0,1.2fr)]">
        <section className="app-panel p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b28d80]">Photo</p>
          <h2 className="mt-2 text-xl font-semibold text-[#221a16]">Update the pet image</h2>
          <p className="mt-2 text-sm leading-7 text-[#7e6d66]">
            Replace the image anytime. We will crop it once so it fills cards and avatars neatly.
          </p>

          <div className="mt-6 flex flex-col items-start gap-5 sm:flex-row sm:items-center xl:flex-col xl:items-start">
            <button type="button" onClick={() => fileInputRef.current?.click()} className="group">
              <EntityAvatar
                src={imagePreview}
                name={form.name || pet.name}
                kind="pet"
                className="h-32 w-32 rounded-[28px] border border-[#f1e3da]"
                textClassName="text-2xl"
              />
              <span className="mt-3 block text-sm font-semibold text-[#5f4d46]">
                {imageFile ? "Previewing new photo" : "Current profile photo"}
              </span>
            </button>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-2xl border border-warm-200 bg-[#fff8f4] px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-white"
              >
                {imageFile ? "Choose another image" : "Replace photo"}
              </button>
              {imageFile && (
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(currentPet.image ?? null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="block text-sm font-semibold text-red-500 transition-colors hover:text-red-600"
                >
                  Revert changes
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
              <Input label="Name *" value={form.name} onChange={(event) => set("name", event.target.value)} required />
              <Input label="Date of birth" type="date" value={form.dob} onChange={(event) => set("dob", event.target.value)} />
              <Input label="Breed" value={form.breed} onChange={(event) => set("breed", event.target.value)} />
              <Input label="Color" value={form.color} onChange={(event) => set("color", event.target.value)} />
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

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Notes</label>
              <textarea
                value={form.notes}
                onChange={(event) => set("notes", event.target.value)}
                rows={5}
                placeholder="Add or refresh anything useful for future reference."
                className="w-full rounded-2xl border border-[#eeddd3] bg-[#f6eee9] px-4 py-3.5 text-sm text-gray-800 placeholder-gray-300 outline-none transition-all focus:border-[#ff7a5c] focus:ring-2 focus:ring-[#ff7a5c]/15 resize-none"
              />
            </div>

            {formError && <InlineError message={formError} />}

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <Link to={`/pets/${id}`} className="sm:min-w-[9rem]">
                <button
                  type="button"
                  className="w-full rounded-2xl border border-[#eeddd3] bg-[#f6eee9] py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-[#eeddd3]"
                >
                  Cancel
                </button>
              </Link>
              <Button type="submit" loading={uploading || updatePet.isPending} className="sm:min-w-[12rem]">
                Save changes
              </Button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
