import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select } from "@/components/ui/Input";
import { planApi } from "@/api/endpoints";

const planTypes = ["Daily", "Weekly", "Monthly", "Quarterly", "Half-Yearly", "Annual", "Premium", "VIP"];

export default function PlanFormModal({ plan, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: "",
    type: "Monthly",
    durationInDays: 30,
    price: "",
    benefits: "",
    description: "",
    isActive: true,
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (plan) {
      setForm({
        name: plan.name,
        type: plan.type,
        durationInDays: plan.durationInDays,
        price: plan.price,
        benefits: (plan.benefits || []).join(", "),
        description: plan.description || "",
        isActive: plan.isActive,
      });
    }
  }, [plan]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        durationInDays: Number(form.durationInDays),
        price: Number(form.price),
        benefits: form.benefits
          .split(",")
          .map((b) => b.trim())
          .filter(Boolean),
      };
      if (plan) {
        await planApi.update(plan._id, payload);
      } else {
        await planApi.create(payload);
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-card bg-surface p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-ink">
            {plan ? "Edit Plan" : "Create Plan"}
          </h3>
          <button onClick={onClose} className="text-ink-faint hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && <div className="mb-4 rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Plan Name</Label>
            <Input name="name" value={form.name} onChange={handleChange} required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Type</Label>
              <Select name="type" value={form.type} onChange={handleChange}>
                {planTypes.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Duration (days)</Label>
              <Input
                name="durationInDays"
                type="number"
                min="1"
                value={form.durationInDays}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label>Price ($)</Label>
              <Input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm text-ink-soft">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                />
                Active
              </label>
            </div>
          </div>

          <div>
            <Label>Benefits (comma separated)</Label>
            <Input
              name="benefits"
              value={form.benefits}
              onChange={handleChange}
              placeholder="Locker, Group classes, Sauna access"
            />
          </div>

          <div>
            <Label>Description</Label>
            <Input name="description" value={form.description} onChange={handleChange} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="volt" disabled={saving}>
              {saving ? "Saving..." : plan ? "Save Changes" : "Create Plan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
