import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select } from "@/components/ui/Input";
import { memberApi, paymentApi, planApi } from "@/api/endpoints";

export default function PaymentFormModal({ onClose, onSaved }) {
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState({
    member: "",
    plan: "",
    amount: "",
    discount: 0,
    tax: 0,
    paymentMethod: "Cash",
    status: "Paid",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    memberApi.list({ limit: 100 }).then((r) => setMembers(r.data.data));
    planApi.list({ isActive: true }).then((r) => setPlans(r.data.data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => {
      const next = { ...f, [name]: value };
      if (name === "plan") {
        const selected = plans.find((p) => p._id === value);
        if (selected) next.amount = selected.price;
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await paymentApi.create({
        ...form,
        amount: Number(form.amount),
        discount: Number(form.discount),
        tax: Number(form.tax),
      });
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
          <h3 className="font-display text-lg font-semibold text-ink">Collect Payment</h3>
          <button onClick={onClose} className="text-ink-faint hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && <div className="mb-4 rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Member</Label>
            <Select name="member" value={form.member} onChange={handleChange} required>
              <option value="">Select member</option>
              {members.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name} ({m.memberId})
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label>Plan</Label>
            <Select name="plan" value={form.plan} onChange={handleChange}>
              <option value="">Select plan</option>
              {plans.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} (${p.price})
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Amount</Label>
              <Input name="amount" type="number" value={form.amount} onChange={handleChange} required />
            </div>
            <div>
              <Label>Discount</Label>
              <Input name="discount" type="number" value={form.discount} onChange={handleChange} />
            </div>
            <div>
              <Label>Tax</Label>
              <Input name="tax" type="number" value={form.tax} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Payment Method</Label>
              <Select name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
                <option>Cash</option>
                <option>Card</option>
                <option>UPI</option>
                <option>Bank Transfer</option>
                <option>Online</option>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select name="status" value={form.status} onChange={handleChange}>
                <option>Paid</option>
                <option>Pending</option>
                <option>Failed</option>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="volt" disabled={saving}>
              {saving ? "Saving..." : "Record Payment"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
