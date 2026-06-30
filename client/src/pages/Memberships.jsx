import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Check, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { planApi } from "@/api/endpoints";
import PlanFormModal from "@/components/memberships/PlanFormModal";
import { cn } from "@/lib/utils";

export default function Memberships() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const fetchPlans = () => {
    setLoading(true);
    planApi.list().then((r) => setPlans(r.data.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this plan?")) return;
    await planApi.remove(id);
    fetchPlans();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink">Membership Plans</h2>
          <p className="text-sm text-ink-soft">Create and manage pricing tiers for your gym.</p>
        </div>
        <Button
          variant="volt"
          onClick={() => {
            setEditingPlan(null);
            setFormOpen(true);
          }}
        >
          <Plus className="h-4 w-4" /> New Plan
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-card border border-line bg-surface" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan._id}
              className={cn(
                "relative flex flex-col rounded-card border bg-surface p-5",
                plan.isFeatured ? "border-violet ring-1 ring-violet/30" : "border-line"
              )}
            >
              {plan.isFeatured && (
                <span className="absolute -top-3 right-5 flex items-center gap-1 rounded-full bg-violet px-2.5 py-1 text-xs font-medium text-white">
                  <Star className="h-3 w-3 fill-white" /> Featured
                </span>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-ink-faint">
                  {plan.type}
                </span>
                <Badge status={plan.isActive ? "Active" : "Inactive"} />
              </div>

              <h3 className="mt-2 font-display text-lg font-semibold text-ink">{plan.name}</h3>

              <div className="mt-3 flex items-baseline gap-1">
                <span className="stat-figure font-display text-3xl font-bold text-ink">
                  ${plan.price}
                </span>
                <span className="text-sm text-ink-faint">/ {plan.durationInDays} days</span>
              </div>

              <ul className="mt-4 flex-1 space-y-2">
                {(plan.benefits || []).map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink-soft">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                    {b}
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setEditingPlan(plan);
                    setFormOpen(true);
                  }}
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(plan._id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <PlanFormModal
          plan={editingPlan}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false);
            fetchPlans();
          }}
        />
      )}
    </div>
  );
}
