import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select } from "@/components/ui/Input";
import { memberApi, planApi, trainerApi } from "@/api/endpoints";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  gender: "Male",
  dob: "",
  address: "",
  currentPlan: "",
  membershipStartDate: new Date().toISOString().slice(0, 10),
  assignedTrainer: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
};

export default function MemberFormModal({ member, onClose, onSaved }) {
  const [form, setForm] = useState(emptyForm);
  const [plans, setPlans] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    planApi.list({ isActive: true }).then((r) => setPlans(r.data.data));
    trainerApi.list().then((r) => setTrainers(r.data.data));
  }, []);

  useEffect(() => {
    if (member) {
      setForm({
        name: member.name || "",
        email: member.email || "",
        phone: member.phone || "",
        gender: member.gender || "Male",
        dob: member.dob ? member.dob.slice(0, 10) : "",
        address: member.address || "",
        currentPlan: member.currentPlan?._id || "",
        membershipStartDate: member.membershipStartDate
          ? member.membershipStartDate.slice(0, 10)
          : new Date().toISOString().slice(0, 10),
        assignedTrainer: member.assignedTrainer?._id || "",
        emergencyContactName: member.emergencyContactName || "",
        emergencyContactPhone: member.emergencyContactPhone || "",
      });
    }
  }, [member]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = { ...form };
      if (!payload.currentPlan) delete payload.currentPlan;
      if (!payload.assignedTrainer) delete payload.assignedTrainer;

      if (member) {
        await memberApi.update(member._id, payload);
      } else {
        await memberApi.create(payload);
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
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto scrollbar-thin rounded-card bg-surface p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-ink">
            {member ? "Edit Member" : "Add New Member"}
          </h3>
          <button onClick={onClose} className="text-ink-faint hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && <div className="mb-4 rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label>Full Name</Label>
              <Input name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div>
              <Label>Phone</Label>
              <Input name="phone" value={form.phone} onChange={handleChange} required />
            </div>
            <div>
              <Label>Email</Label>
              <Input name="email" type="email" value={form.email} onChange={handleChange} />
            </div>
            <div>
              <Label>Gender</Label>
              <Select name="gender" value={form.gender} onChange={handleChange}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </Select>
            </div>
            <div>
              <Label>Date of Birth</Label>
              <Input name="dob" type="date" value={form.dob} onChange={handleChange} />
            </div>
            <div className="col-span-2">
              <Label>Address</Label>
              <Input name="address" value={form.address} onChange={handleChange} />
            </div>

            <div>
              <Label>Membership Plan</Label>
              <Select name="currentPlan" value={form.currentPlan} onChange={handleChange}>
                <option value="">Select plan</option>
                {plans.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} (${p.price})
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Membership Start Date</Label>
              <Input
                name="membershipStartDate"
                type="date"
                value={form.membershipStartDate}
                onChange={handleChange}
              />
            </div>

            <div className="col-span-2">
              <Label>Assigned Trainer</Label>
              <Select name="assignedTrainer" value={form.assignedTrainer} onChange={handleChange}>
                <option value="">No trainer assigned</option>
                {trainers.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label>Emergency Contact Name</Label>
              <Input
                name="emergencyContactName"
                value={form.emergencyContactName}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Emergency Contact Phone</Label>
              <Input
                name="emergencyContactPhone"
                value={form.emergencyContactPhone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="volt" disabled={saving}>
              {saving ? "Saving..." : member ? "Save Changes" : "Add Member"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
