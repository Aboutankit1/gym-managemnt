import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function StatCard({ icon: Icon, label, value, trend, trendUp, accent = "violet" }) {
  const accents = {
    violet: "bg-violet-soft text-violet",
    volt: "bg-volt/20 text-volt-ink",
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning",
    danger: "bg-danger-soft text-danger",
  };

  return (
    <div className="rounded-card border border-line bg-surface p-5">
      <div className="flex items-start justify-between">
        <div className={cn("grid h-10 w-10 place-items-center rounded-lg", accents[accent])}>
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>
        {trend && (
          <span
            className={cn(
              "flex items-center gap-0.5 text-xs font-medium",
              trendUp ? "text-success" : "text-danger"
            )}
          >
            {trendUp ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {trend}
          </span>
        )}
      </div>
      <p className="stat-figure mt-4 text-2xl font-semibold text-ink">{value}</p>
      <p className="mt-1 text-sm text-ink-soft">{label}</p>
    </div>
  );
}
