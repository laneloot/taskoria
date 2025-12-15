import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Task } from "@/lib/types";
import { Edit2, Plus, Trash2 } from "lucide-react";

interface TasksSectionProps {
  tasks: Task[];
  title?: string;
  description?: string;
  onCreate?: () => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

const statusText: Record<Task["status"], string> = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
  blocked: "Blocked",
};

const priorityStyle: Record<Task["priority"], { label: string; variant: "outline" | "warning" | "success" | "default" }> = {
  low: { label: "Low", variant: "outline" },
  medium: { label: "Medium", variant: "default" },
  high: { label: "High", variant: "warning" },
};

export const TasksSection = ({
  tasks,
  title = "My Tasks",
  description = "Sorted by recent updates. Update them via the UI to keep everyone aligned.",
  onCreate,
  onEdit,
  onDelete,
}: TasksSectionProps) => {
  const showActions = Boolean(onEdit || onDelete);

  return (
  <Card id="tasks" className="border-0 bg-white/90 shadow-xl shadow-zinc-200/70">
    <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>
      {onCreate && (
        <Button onClick={onCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          New task
        </Button>
      )}
    </CardHeader>
    <CardContent>
      {tasks.length === 0 ? (
        <p className="text-sm text-zinc-500">No tasks assigned yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-zinc-500">
                <th className="pb-3 pr-4 font-medium">Task</th>
                <th className="pb-3 pr-4 font-medium">Project</th>
                <th className="pb-3 pr-4 font-medium">Priority</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
                <th className="pb-3 pr-4 font-medium">Due</th>
                <th className="pb-3 pr-4 font-medium">Assignee</th>
                {showActions && <th className="pb-3 font-medium">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {tasks.map((task) => (
                <tr key={task.id} className="align-top">
                  <td className="py-4 pr-4">
                    <p className="font-semibold text-zinc-900 dark:text-white">{task.title}</p>
                    {task.description && <p className="mt-1 text-xs text-zinc-500">{task.description}</p>}
                  </td>
                  <td className="py-4 pr-4 text-zinc-600">{task.project_name}</td>
                  <td className="py-4 pr-4">
                    <Badge variant={priorityStyle[task.priority].variant}>{priorityStyle[task.priority].label}</Badge>
                  </td>
                  <td className="py-4 pr-4">
                    <Badge variant={task.status === "done" ? "success" : task.status === "blocked" ? "warning" : "outline"}>
                      {statusText[task.status]}
                    </Badge>
                  </td>
                  <td className="py-4 pr-4 text-zinc-600">{task.due_date ? new Date(task.due_date).toLocaleDateString() : " - "}</td>
                  <td className="py-4 pr-4 text-zinc-600">{task.assignee_username ?? "Unassigned"}</td>
                  {showActions && (
                    <td className="py-4">
                      <div className="flex gap-2">
                        {onEdit && (
                          <Button variant="secondary" size="sm" className="gap-1" onClick={() => onEdit(task)}>
                            <Edit2 className="h-4 w-4" />
                            Edit
                          </Button>
                        )}
                        {onDelete && (
                          <Button variant="ghost" size="sm" className="gap-1 text-red-600 hover:bg-red-50" onClick={() => onDelete(task)}>
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </CardContent>
  </Card>
  );
};
