import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { UserPlus, Wallet } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function ActivityFeed({ activity = [] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {activity.length === 0 ? (
          <p className="py-8 text-center text-sm text-ink-faint">Nothing to show yet.</p>
        ) : (
          <ul className="space-y-4">
            {activity.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <div
                  className={
                    "mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg " +
                    (item.type === "Payment" ? "bg-success-soft text-success" : "bg-violet-soft text-violet")
                  }
                >
                  {item.type === "Payment" ? (
                    <Wallet className="h-4 w-4" />
                  ) : (
                    <UserPlus className="h-4 w-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm text-ink">{item.message}</p>
                  <p className="text-xs text-ink-faint">
                    {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
