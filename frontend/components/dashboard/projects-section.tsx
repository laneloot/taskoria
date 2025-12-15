import { Project } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit2, Plus, Trash2 } from "lucide-react";

interface ProjectsSectionProps {
  projects: Project[];
  title?: string;
  description?: string;
  onCreate?: () => void;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
}

const statusCopy: Record<Project["status"], { label: string; variant: "default" | "success" | "warning" | "outline" }> = {
  planning: { label: "Planning", variant: "outline" },
  active: { label: "Active", variant: "default" },
  completed: { label: "Completed", variant: "success" },
  archived: { label: "Archived", variant: "warning" },
};

export const ProjectsSection = ({
  projects,
  title = "Projects",
  description = "Live sync with your Django API. Showing the latest accessible projects.",
  onCreate,
  onEdit,
  onDelete,
}: ProjectsSectionProps) => (
  <Card id="projects" className="border-0 bg-white/90 shadow-xl shadow-zinc-200/70">
    <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>
      {onCreate && (
        <Button onClick={onCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          New project
        </Button>
      )}
    </CardHeader>
    <CardContent className="space-y-4">
      {projects.length === 0 && <p className="text-sm text-zinc-500">No projects yet. Create one in the backend to get started.</p>}
      {projects.map((project) => (
        <div
          key={project.id}
          className="flex flex-col gap-3 rounded-2xl border border-zinc-100 bg-gradient-to-br from-white via-white to-zinc-50/70 p-4 shadow-sm dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-lg font-semibold text-zinc-900 dark:text-white">{project.name}</p>
              <p className="text-xs uppercase tracking-wide text-zinc-400">Owned by {project.owner}</p>
            </div>
            <Badge variant={statusCopy[project.status].variant}>{statusCopy[project.status].label}</Badge>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">{project.description || "No description"}</p>
          <div className="flex items-center gap-4">
            <div className="h-2 flex-1 rounded-full bg-zinc-200 dark:bg-zinc-800">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500"
                style={{ width: `${project.progress}%` }}
              />
            </div>
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">{project.progress}%</span>
          </div>
          <div className="text-xs text-zinc-500">
            {project.completed_tasks_count} / {project.tasks_count} tasks complete • Updated {new Date(project.updated_at).toLocaleDateString()}
          </div>
          {(onEdit || onDelete) && (
            <div className="flex gap-2">
              {onEdit && (
                <Button variant="secondary" className="flex-1 gap-2" onClick={() => onEdit(project)}>
                  <Edit2 className="h-4 w-4" />
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button variant="ghost" className="flex-1 gap-2 text-red-600 hover:text-red-700" onClick={() => onDelete(project)}>
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>
      ))}
    </CardContent>
  </Card>
);
