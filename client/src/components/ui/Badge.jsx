import { cn } from "@/lib/utils";

const statusMap = {
  Active: "bg-success-soft text-success",
  Paid: "bg-success-soft text-success",
  "Expiring Soon": "bg-warning-soft text-warning",
  Pending: "bg-warning-soft text-warning",
  Expired: "bg-danger-soft text-danger",
  Failed: "bg-danger-soft text-danger",
  Inactive: "bg-bg text-ink-faint",
  Refunded: "bg-violet-soft text-violet",
};

export function Badge({ status, className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        statusMap[status] || "bg-bg text-ink-soft",
        className
      )}
    >
      {children || status}
    </span>
  );
}
