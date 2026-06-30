import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

const COLORS = ["#6d5bff", "#c8ff4d", "#1fae6b", "#f5a524", "#f0473e", "#5a5e6e", "#9296a6", "#1c2400"];

export default function MembershipDonut({ data = [] }) {
  const chartData = data.map((d) => ({ name: d.type, value: d.count }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan Distribution</CardTitle>
      </CardHeader>
      <CardContent className="h-72 pt-4">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-ink-faint">
            No active memberships yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e8eaf1", fontSize: 12 }} />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
