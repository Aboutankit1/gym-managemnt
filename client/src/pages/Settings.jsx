import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="max-w-xl space-y-5">
      <div>
        <h2 className="font-display text-xl font-semibold text-ink">Settings</h2>
        <p className="text-sm text-ink-soft">Your account details.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-4 text-sm">
          <div className="flex justify-between border-b border-line pb-3">
            <span className="text-ink-soft">Name</span>
            <span className="font-medium text-ink">{user?.name}</span>
          </div>
          <div className="flex justify-between border-b border-line pb-3">
            <span className="text-ink-soft">Email</span>
            <span className="font-medium text-ink">{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-soft">Role</span>
            <span className="font-medium capitalize text-ink">{user?.role}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
