import { useEffect, useState } from "react";
import { Users, UserCheck, UserX, Dumbbell, Wallet, CalendarClock, AlertCircle, Plus, CreditCard, FileText } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import MembershipDonut from "@/components/dashboard/MembershipDonut";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import { Button } from "@/components/ui/Button";
import { dashboardApi } from "@/api/endpoints";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [distribution, setDistribution] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      dashboardApi.summary(),
      dashboardApi.revenueTrend(),
      dashboardApi.membershipDistribution(),
      dashboardApi.recentActivity(),
    ])
      .then(([s, r, d, a]) => {
        setSummary(s.data.data);
        setRevenueTrend(r.data.data);
        setDistribution(d.data.data);
        setActivity(a.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = summary
    ? [
        { icon: Users, label: "Total Members", value: summary.totalMembers, accent: "violet" },
        { icon: UserCheck, label: "Active Members", value: summary.activeMembers, accent: "success" },
        { icon: UserX, label: "Expired Memberships", value: summary.expiredMembers, accent: "danger" },
        { icon: CalendarClock, label: "Expiring Soon", value: summary.expiringSoon, accent: "warning" },
        { icon: Dumbbell, label: "Trainers", value: summary.totalTrainers, accent: "violet" },
        { icon: Wallet, label: "Revenue (This Month)", value: `$${summary.monthlyRevenue.toLocaleString()}`, accent: "volt" },
        { icon: AlertCircle, label: "Pending Payments", value: summary.pendingPayments, accent: "warning" },
        { icon: UserCheck, label: "Today's Attendance", value: summary.todayAttendance, accent: "success" },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Quick actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink">Welcome back 👋</h2>
          <p className="text-sm text-ink-soft">Here's what's happening at your gym today.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="volt" onClick={() => navigate("/members?new=1")}>
            <Plus className="h-4 w-4" /> Add Member
          </Button>
          <Button variant="outline" onClick={() => navigate("/payments?new=1")}>
            <CreditCard className="h-4 w-4" /> Collect Payment
          </Button>
          <Button variant="outline" onClick={() => navigate("/memberships")}>
            <FileText className="h-4 w-4" /> Manage Plans
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-[124px] animate-pulse rounded-card border border-line bg-surface" />
            ))
          : cards.map((c) => <StatCard key={c.label} {...c} />)}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart data={revenueTrend} />
        </div>
        <MembershipDonut data={distribution} />
      </div>

      {/* Activity */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ActivityFeed activity={activity} />
        </div>
      </div>
    </div>
  );
}
