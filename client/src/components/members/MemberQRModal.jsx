import { X, Download, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function MemberQRModal({ member, onClose }) {
  const downloadCard = () => {
    const link = document.createElement("a");
    link.href = member.qrCode;
    link.download = `${member.memberId}-qr.png`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-card bg-surface p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-ink">Membership Card</h3>
          <button onClick={onClose} className="text-ink-faint hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Card design */}
        <div className="overflow-hidden rounded-xl bg-sidebar p-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-volt">
                <Dumbbell className="h-4 w-4 text-volt-ink" />
              </div>
              <span className="font-display text-sm font-semibold">FlexCore</span>
            </div>
            <span className="font-mono text-xs text-white/50">{member.memberId}</span>
          </div>

          <div className="mt-5 flex items-center gap-4">
            <div className="rounded-lg bg-white p-2">
              <img src={member.qrCode} alt="Membership QR" className="h-24 w-24" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-display text-base font-semibold">{member.name}</p>
              <p className="text-xs text-white/50">{member.currentPlan?.name || "No active plan"}</p>
              <p className="mt-2 text-xs text-white/50">
                Valid until{" "}
                {member.membershipEndDate
                  ? new Date(member.membershipEndDate).toLocaleDateString()
                  : "—"}
              </p>
            </div>
          </div>
        </div>

        <Button variant="volt" className="mt-4 w-full" onClick={downloadCard}>
          <Download className="h-4 w-4" /> Download Card
        </Button>
      </div>
    </div>
  );
}
