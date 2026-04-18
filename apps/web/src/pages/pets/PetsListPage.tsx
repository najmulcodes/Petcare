import { Link } from "react-router-dom";
import { usePets, useDeletePet } from "../../hooks/usePets";
import { PageSpinner } from "../../components/ui/Spinner";
import { ErrorState } from "../../components/ui/ErrorState";
import { EntityAvatar } from "../../components/ui/EntityAvatar";

function calcAge(dob: string | null): string {
  if (!dob) return "Unknown age";

  const birth = new Date(dob);
  const now = new Date();
  const totalMonths = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());

  if (totalMonths < 1) return "Under 1 month";
  if (totalMonths < 12) return `${totalMonths} months`;

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  return months > 0 ? `${years}y ${months}m` : `${years} years`;
}

export function PetsListPage() {
  const { data: pets, isLoading, error, refetch } = usePets();
  const deletePet = useDeletePet();

  if (isLoading) return <PageSpinner />;
  if (error) return <ErrorState message="Failed to load pets." onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <section className="app-panel p-5 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#b28d80]">Pets</p>
            <h1 className="mt-2 text-3xl font-semibold text-[#221a16] sm:text-4xl">Pet profiles</h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-[#7e6d66]">
              Keep every pet in one well-structured list so records, photos, and care history stay easy to reach.
            </p>
          </div>

          <Link
            to="/pets/add"
            className="inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold text-white"
            style={{ background: "#ff7a5c", boxShadow: "0 16px 28px rgba(255, 122, 92, 0.18)" }}
          >
            Add pet
          </Link>
        </div>
      </section>

      {!pets || pets.length === 0 ? (
        <section className="app-panel px-5 py-10 text-center sm:px-8">
          <h2 className="text-2xl font-semibold text-[#221a16]">No pets yet</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#7e6d66]">
            Add your first pet to start capturing photos, care records, vaccinations, and the details you want in one dependable place.
          </p>
          <Link
            to="/pets/add"
            className="mt-6 inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold text-white"
            style={{ background: "#ff7a5c" }}
          >
            Create first profile
          </Link>
        </section>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {pets.map((pet) => (
            <article key={pet.id} className="app-panel p-5">
              <div className="flex items-start gap-4">
                <EntityAvatar
                  src={pet.image}
                  name={pet.name}
                  kind="pet"
                  className="h-16 w-16 rounded-[24px] border border-[#f1e3da]"
                  textClassName="text-lg"
                />
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-xl font-semibold text-[#221a16]">{pet.name}</h2>
                  <p className="mt-1 text-sm text-[#7e6d66]">{pet.breed || "Pet profile ready for more details"}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-[#fff4f1] px-3 py-1 text-xs font-semibold text-[#ff7a5c]">
                      {calcAge(pet.dob)}
                    </span>
                    {pet.gender && (
                      <span className="rounded-full bg-[#f0faf5] px-3 py-1 text-xs font-semibold capitalize text-emerald-700">
                        {pet.gender}
                      </span>
                    )}
                    {pet.color && (
                      <span className="rounded-full bg-[#fff8f4] px-3 py-1 text-xs font-semibold text-[#8c776f]">
                        {pet.color}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {pet.notes && (
                <p className="mt-4 rounded-[22px] bg-[#fff8f4] px-4 py-3 text-sm leading-7 text-[#7e6d66]">
                  {pet.notes}
                </p>
              )}

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link to={`/pets/${pet.id}`} className="sm:flex-1">
                  <button className="w-full rounded-2xl border border-warm-200 bg-[#fff8f4] py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-white">
                    View details
                  </button>
                </Link>
                <Link to={`/pets/${pet.id}/edit`} className="sm:flex-1">
                  <button className="w-full rounded-2xl border border-warm-200 bg-[#fff8f4] py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-white">
                    Edit profile
                  </button>
                </Link>
              </div>

              <button
                className="mt-3 inline-flex text-sm font-semibold text-red-500 transition-colors hover:text-red-600 disabled:opacity-50"
                disabled={deletePet.isPending}
                onClick={() => {
                  if (confirm(`Delete ${pet.name}? This cannot be undone.`)) {
                    deletePet.mutate(pet.id);
                  }
                }}
              >
                Delete profile
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
