import { useEffect, useState, useCallback } from "react";
import { Plus, Search, QrCode, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { memberApi } from "@/api/endpoints";
import MemberFormModal from "@/components/members/MemberFormModal";
import MemberQRModal from "@/components/members/MemberQRModal";
import { useSearchParams } from "react-router-dom";

export default function Members() {
  const [members, setMembers] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [qrMember, setQrMember] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const fetchMembers = useCallback(
    (page = 1) => {
      setLoading(true);
      memberApi
        .list({ search, status, page, limit: 8 })
        .then((r) => {
          setMembers(r.data.data);
          setPagination(r.data.pagination);
        })
        .finally(() => setLoading(false));
    },
    [search, status]
  );

  useEffect(() => {
    fetchMembers(1);
  }, [fetchMembers]);

  useEffect(() => {
    if (searchParams.get("new")) {
      setFormOpen(true);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this member? This cannot be undone.")) return;
    await memberApi.remove(id);
    fetchMembers(pagination.page);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <Input
            placeholder="Search by name, ID, phone..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-44">
            <option value="">All statuses</option>
            <option value="Active">Active</option>
            <option value="Expiring Soon">Expiring Soon</option>
            <option value="Expired">Expired</option>
            <option value="Inactive">Inactive</option>
          </Select>
          <Button
            variant="volt"
            onClick={() => {
              setEditingMember(null);
              setFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" /> Add Member
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-bg text-xs uppercase text-ink-faint">
              <tr>
                <th className="px-5 py-3 font-medium">Member</th>
                <th className="px-5 py-3 font-medium">Phone</th>
                <th className="px-5 py-3 font-medium">Plan</th>
                <th className="px-5 py-3 font-medium">Expires</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-ink-faint">
                    Loading members...
                  </td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-ink-faint">
                    No members found.
                  </td>
                </tr>
              ) : (
                members.map((m) => (
                  <tr key={m._id} className="hover:bg-bg/60">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-violet-soft font-display text-xs font-semibold text-violet">
                          {m.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-ink">{m.name}</p>
                          <p className="font-mono text-xs text-ink-faint">{m.memberId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-ink-soft">{m.phone}</td>
                    <td className="px-5 py-3 text-ink-soft">{m.currentPlan?.name || "—"}</td>
                    <td className="px-5 py-3 text-ink-soft">
                      {m.membershipEndDate ? new Date(m.membershipEndDate).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-5 py-3">
                      <Badge status={m.membershipStatus} />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          title="Membership QR card"
                          onClick={() => setQrMember(m)}
                          className="grid h-8 w-8 place-items-center rounded-lg text-ink-faint hover:bg-bg hover:text-violet"
                        >
                          <QrCode className="h-4 w-4" />
                        </button>
                        <button
                          title="Edit"
                          onClick={() => {
                            setEditingMember(m);
                            setFormOpen(true);
                          }}
                          className="grid h-8 w-8 place-items-center rounded-lg text-ink-faint hover:bg-bg hover:text-ink"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          title="Delete"
                          onClick={() => handleDelete(m._id)}
                          className="grid h-8 w-8 place-items-center rounded-lg text-ink-faint hover:bg-danger-soft hover:text-danger"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-line px-5 py-3 text-sm text-ink-soft">
          <span>
            Showing {members.length} of {pagination.total} members
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={pagination.page <= 1}
              onClick={() => fetchMembers(pagination.page - 1)}
              className="grid h-8 w-8 place-items-center rounded-lg border border-line disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 font-mono text-xs">
              {pagination.page} / {pagination.pages || 1}
            </span>
            <button
              disabled={pagination.page >= pagination.pages}
              onClick={() => fetchMembers(pagination.page + 1)}
              className="grid h-8 w-8 place-items-center rounded-lg border border-line disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Card>

      {formOpen && (
        <MemberFormModal
          member={editingMember}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false);
            fetchMembers(pagination.page);
          }}
        />
      )}

      {qrMember && <MemberQRModal member={qrMember} onClose={() => setQrMember(null)} />}
    </div>
  );
}
