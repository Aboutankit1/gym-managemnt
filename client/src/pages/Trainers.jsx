import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { trainerApi } from "@/api/endpoints";
import TrainerFormModal from "@/components/trainers/TrainerFormModal";

export default function Trainers() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchTrainers = () => {
    setLoading(true);
    trainerApi.list().then((r) => setTrainers(r.data.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Remove this trainer?")) return;
    await trainerApi.remove(id);
    fetchTrainers();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink">Trainers</h2>
          <p className="text-sm text-ink-soft">Manage your training staff.</p>
        </div>
        <Button
          variant="volt"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus className="h-4 w-4" /> Add Trainer
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-card border border-line bg-surface" />
          ))}
        </div>
      ) : trainers.length === 0 ? (
        <div className="rounded-card border border-dashed border-line bg-surface py-16 text-center text-ink-faint">
          No trainers added yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trainers.map((t) => (
            <div key={t._id} className="rounded-card border border-line bg-surface p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-violet-soft font-display text-base font-semibold text-violet">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-display font-semibold text-ink">{t.name}</p>
                  <p className="text-xs text-ink-faint">{t.experienceYears} yrs experience</p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {(t.specialization || []).map((s, i) => (
                  <span key={i} className="rounded-full bg-bg px-2 py-0.5 text-xs text-ink-soft">
                    {s}
                  </span>
                ))}
              </div>

              <div className="mt-3 space-y-1 text-sm text-ink-soft">
                <p className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5" /> {t.phone}
                </p>
                {t.email && (
                  <p className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" /> {t.email}
                  </p>
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setEditing(t);
                    setFormOpen(true);
                  }}
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(t._id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <TrainerFormModal
          trainer={editing}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false);
            fetchTrainers();
          }}
        />
      )}
    </div>
  );
}
