import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { trainerApi } from "@/api/endpoints";

export default function TrainerFormModal({ trainer, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    experienceYears: 0,
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (trainer) {
      setForm({
        name: trainer.name,
        email: trainer.email || "",
        phone: trainer.phone,
        specialization: (trainer.specialization || []).join(", "),
        experienceYears: trainer.experienceYears || 0,
      });
    }
  }, [trainer]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        experienceYears: Number(form.experienceYears),
        specialization: form.specialization
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      if (trainer) {
        await trainerApi.update(trainer._id, payload);
      } else {
        await trainerApi.create(payload);
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
            {trainer ? "Edit Trainer" : "Add Trainer"}
          </h3>
          <button onClick={onClose} className="text-ink-faint hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && <div className="mb-4 rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Full Name</Label>
            <Input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Phone</Label>
              <Input name="phone" value={form.phone} onChange={handleChange} required />
            </div>
            <div>
              <Label>Email</Label>
              <Input name="email" type="email" value={form.email} onChange={handleChange} />
            </div>
          </div>
          <div>
            <Label>Specialization (comma separated)</Label>
            <Input
              name="specialization"
              value={form.specialization}
              onChange={handleChange}
              placeholder="Strength, CrossFit, Yoga"
            />
          </div>
          <div>
            <Label>Years of Experience</Label>
            <Input
              name="experienceYears"
              type="number"
              min="0"
              value={form.experienceYears}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="volt" disabled={saving}>
              {saving ? "Saving..." : trainer ? "Save Changes" : "Add Trainer"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
