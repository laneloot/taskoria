import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskDistributionResponse, WeeklyProductivityPoint } from "@/lib/types";

interface AnalyticsSectionProps {
  distribution?: TaskDistributionResponse;
  weeklyTrend?: WeeklyProductivityPoint[];
}

const toEntries = (record?: Record<string, number>) =>
  record ? Object.entries(record) : [];

export const AnalyticsSection = ({ distribution, weeklyTrend }: AnalyticsSectionProps) => {
  const statusEntries = toEntries(distribution?.status);
  const priorityEntries = toEntries(distribution?.priority);
  const productivity = weeklyTrend ?? [];

  return (
    <Card id="analytics">
      <CardHeader>
        <CardTitle>Analytics</CardTitle>
        <CardDescription>Fresh metrics computed by the analytics endpoints.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        <div>
          <h4 className="text-sm font-semibold text-zinc-500">Status distribution</h4>
          <div className="mt-3 space-y-3">
            {statusEntries.length === 0 && <p className="text-sm text-zinc-500">No data yet.</p>}
            {statusEntries.map(([status, count]) => (
              <div key={status}>
                <div className="flex justify-between text-xs text-zinc-500">
                  <span className="capitalize">{status.replace("_", " ")}</span>
                  <span>{count}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-zinc-200">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-sky-500"
                    style={{ width: `${Math.min(100, count * 12)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-zinc-500">Priority mix</h4>
          <div className="mt-3 space-y-3">
            {priorityEntries.length === 0 && <p className="text-sm text-zinc-500">No data yet.</p>}
            {priorityEntries.map(([priority, count]) => (
              <div key={priority} className="flex items-center justify-between rounded-lg border border-zinc-100 px-3 py-2 text-sm dark:border-zinc-800">
                <span className="capitalize">{priority}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
          <h4 className="mt-6 text-sm font-semibold text-zinc-500">Weekly productivity</h4>
          <div className="mt-3 space-y-2">
            {productivity.length === 0 && <p className="text-sm text-zinc-500">No completed tasks in the last week.</p>}
            {productivity.map((entry) => (
              <div key={entry.date} className="flex items-center gap-2">
                <span className="w-24 text-xs text-zinc-500">{new Date(entry.date).toLocaleDateString(undefined, { weekday: "short" })}</span>
                <div className="h-2 flex-1 rounded-full bg-zinc-200">
                  <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${Math.min(entry.count * 20, 100)}%` }} />
                </div>
                <span className="w-8 text-right text-xs font-semibold">{entry.count}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
