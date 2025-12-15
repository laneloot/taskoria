import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserSummary } from "@/lib/types";

interface OverviewCardsProps {
  summary?: UserSummary;
}

const formatValue = (value?: number) => (typeof value === "number" ? value.toLocaleString() : "-");

export const OverviewCards = ({ summary }: OverviewCardsProps) => {
  const cards = [
    {
      label: "Total tasks",
      value: formatValue(summary?.total_tasks),
      description: "Across every project you participate in.",
    },
    {
      label: "Completed",
      value: formatValue(summary?.completed_tasks),
      description: "Wrapped up and delivered tasks.",
    },
    {
      label: "Active",
      value: formatValue(summary?.active_tasks),
      description: "Currently in progress or queued.",
    },
    {
      label: "Overdue",
      value: formatValue(summary?.overdue_tasks),
      description: "Tasks needing attention.",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label} className="relative overflow-hidden">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-zinc-500">{card.label}</CardTitle>
            <CardContent className="p-0">
              <p className="text-3xl font-semibold text-zinc-900 dark:text-white">{card.value}</p>
            </CardContent>
            <CardDescription>{card.description}</CardDescription>
          </CardHeader>
          <div className="absolute inset-x-6 bottom-0 h-1 rounded-full bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500" />
        </Card>
      ))}
    </div>
  );
};
