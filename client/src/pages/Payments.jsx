import { useEffect, useState, useCallback } from "react";
import { Plus, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { paymentApi } from "@/api/endpoints";
import PaymentFormModal from "@/components/payments/PaymentFormModal";
import { useSearchParams } from "react-router-dom";
import api from "@/api/axios";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const fetchPayments = useCallback((page = 1) => {
    setLoading(true);
    paymentApi
      .list({ page, limit: 8 })
      .then((r) => {
        setPayments(r.data.data);
        setPagination(r.data.pagination);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchPayments(1);
  }, [fetchPayments]);

  useEffect(() => {
    if (searchParams.get("new")) {
      setFormOpen(true);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const downloadInvoice = async (id, invoiceNumber) => {
    const res = await api.get(`/payments/${id}/invoice`, { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${invoiceNumber}.pdf`;
    link.click();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink">Payments</h2>
          <p className="text-sm text-ink-soft">Collect fees and manage invoices.</p>
        </div>
        <Button variant="volt" onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4" /> Collect Payment
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-bg text-xs uppercase text-ink-faint">
              <tr>
                <th className="px-5 py-3 font-medium">Invoice #</th>
                <th className="px-5 py-3 font-medium">Member</th>
                <th className="px-5 py-3 font-medium">Plan</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-ink-faint">
                    Loading payments...
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-ink-faint">
                    No payments recorded yet.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p._id} className="hover:bg-bg/60">
                    <td className="px-5 py-3 font-mono text-xs text-ink-soft">{p.invoiceNumber}</td>
                    <td className="px-5 py-3 text-ink">{p.member?.name || "—"}</td>
                    <td className="px-5 py-3 text-ink-soft">{p.plan?.name || "—"}</td>
                    <td className="stat-figure px-5 py-3 font-medium text-ink">
                      ${p.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-5 py-3 text-ink-soft">
                      {new Date(p.paymentDate).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3">
                      <Badge status={p.status} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => downloadInvoice(p._id, p.invoiceNumber)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-violet hover:underline"
                      >
                        <Download className="h-3.5 w-3.5" /> PDF
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-line px-5 py-3 text-sm text-ink-soft">
          <span>
            Showing {payments.length} of {pagination.total} payments
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={pagination.page <= 1}
              onClick={() => fetchPayments(pagination.page - 1)}
              className="grid h-8 w-8 place-items-center rounded-lg border border-line disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 font-mono text-xs">
              {pagination.page} / {pagination.pages || 1}
            </span>
            <button
              disabled={pagination.page >= pagination.pages}
              onClick={() => fetchPayments(pagination.page + 1)}
              className="grid h-8 w-8 place-items-center rounded-lg border border-line disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Card>

      {formOpen && (
        <PaymentFormModal
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false);
            fetchPayments(pagination.page);
          }}
        />
      )}
    </div>
  );
}
