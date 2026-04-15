import { Link } from "react-router-dom";
import { usePets, useDeletePet } from "../../hooks/usePets";
import { PageSpinner } from "../../components/ui/Spinner";
import { ErrorState } from "../../components/ui/ErrorState";

function calcAge(dob: string | null): string {
  if (!dob) return "Unknown age";
  const birth = new Date(dob);
  const now = new Date();
  const totalMonths = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  if (totalMonths < 1) return "< 1mo";
  if (totalMonths < 12) return `${totalMonths}mo`;
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  return months > 0 ? `${years}y ${months}m` : `${years}yr`;
}

export function PetsListPage() {
  const { data: pets, isLoading, error, refetch } = usePets();
  const deletePet = useDeletePet();

  if (isLoading) return <PageSpinner />;
  if (error) return <ErrorState message="Failed to load pets." onRetry={() => refetch()} />;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Pets 🐾</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {pets?.length ?? 0} pet{pets?.length !== 1 ? "s" : ""} registered
          </p>
        </div>
        <Link to="/pets/add">
          <button
            className="rounded-2xl px-4 py-2 text-sm font-semibold text-white transition-all hover:scale-[1.02]"
            style={{ background: "#ff7a5c", boxShadow: "0 4px 16px rgba(255,122,92,0.3)" }}
          >
            + Add pet
          </button>
        </Link>
      </div>

      {!pets || pets.length === 0 ? (
        <div className="rounded-3xl bg-white p-10 text-center shadow-soft">
          <p className="text-4xl mb-3">🐣</p>
          <p className="font-semibold text-gray-700">No pets yet</p>
          <p className="mt-1 text-sm text-gray-400">Add your first pet to get started.</p>
          <Link to="/pets/add">
            <button
              className="mt-5 rounded-2xl px-6 py-2.5 text-sm font-semibold text-white"
              style={{ background: "#ff7a5c" }}
            >
              Add your first pet
            </button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet) => (
            <div key={pet.id} className="rounded-3xl bg-white p-5 shadow-soft">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-2xl bg-[#fff4f1] flex items-center justify-center text-3xl">
                  {pet.image ? (
                    <img
                      src={pet.image}
                      alt={pet.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    "🐶"
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-bold text-gray-900">{pet.name}</h2>
                  {pet.breed && <p className="text-xs text-gray-400">{pet.breed}</p>}
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-[#fff4f1] px-2.5 py-0.5 text-xs font-medium text-[#ff7a5c]">
                      {calcAge(pet.dob)}
                    </span>
                    {pet.gender && (
                      <span className="rounded-full bg-[#f0faf5] px-2.5 py-0.5 text-xs font-medium text-emerald-600 capitalize">
                        {pet.gender}
                      </span>
                    )}
                    {pet.color && (
                      <span className="rounded-full bg-warm-50 px-2.5 py-0.5 text-xs font-medium text-gray-500">
                        {pet.color}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Link to={`/pets/${pet.id}`} className="flex-1">
                  <button className="w-full rounded-2xl border border-warm-200 bg-[#f6eee9] py-2 text-xs font-semibold text-gray-600 hover:bg-warm-100 transition-colors">
                    View
                  </button>
                </Link>
                <Link to={`/pets/${pet.id}/edit`} className="flex-1">
                  <button className="w-full rounded-2xl border border-warm-200 bg-[#f6eee9] py-2 text-xs font-semibold text-gray-600 hover:bg-warm-100 transition-colors">
                    Edit
                  </button>
                </Link>
                <button
                  className="rounded-2xl bg-red-50 px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-100 transition-colors disabled:opacity-50"
                  disabled={deletePet.isPending}
                  onClick={() => {
                    if (confirm(`Delete ${pet.name}? This cannot be undone.`)) {
                      deletePet.mutate(pet.id);
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
