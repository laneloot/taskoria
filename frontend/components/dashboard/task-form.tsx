"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Project, Task, TaskPayload, TaskPriority, TaskStatus } from "@/lib/types";

const priorityOptions: TaskPriority[] = ["low", "medium", "high"];
const statusOptions: TaskStatus[] = ["todo", "in_progress", "done", "blocked"];

interface TaskFormProps {
  projects: Project[];
  initialTask?: Task;
  loading?: boolean;
  error?: string | null;
  onSubmit: (payload: TaskPayload) => Promise<void> | void;
  onCancel: () => void;
}

export const TaskForm = ({ projects, initialTask, loading, error, onSubmit, onCancel }: TaskFormProps) => {
  const fallbackProjectId = projects[0]?.id ?? 0;
  const [form, setForm] = useState(() => ({
    title: initialTask?.title ?? "",
    description: initialTask?.description ?? "",
    project: String(initialTask?.project ?? fallbackProjectId ?? ""),
    priority: initialTask?.priority ?? "medium",
    status: initialTask?.status ?? "todo",
    due_date: initialTask?.due_date ? initialTask.due_date.slice(0, 10) : "",
    assignee: initialTask?.assignee ? String(initialTask.assignee) : "",
  }));

  const canSubmit = useMemo(() => form.title.trim().length > 0 && Boolean(Number(form.project)), [form]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;

    const payload: TaskPayload = {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      project: Number(form.project),
      priority: form.priority as TaskPriority,
      status: form.status as TaskStatus,
      due_date: form.due_date || null,
      assignee: form.assignee ? Number(form.assignee) : null,
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="task-title">Title</Label>
        <Input
          id="task-title"
          value={form.title}
          onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
          placeholder="Design onboarding flow"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="task-description">Description</Label>
        <Textarea
          id="task-description"
          rows={4}
          value={form.description}
          onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
          placeholder="Outline acceptance criteria, dependencies, and stakeholders."
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="task-project">Project</Label>
          <select
            id="task-project"
            className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:border-zinc-800 dark:bg-zinc-950"
            value={form.project}
            onChange={(event) => setForm((prev) => ({ ...prev, project: event.target.value }))}
            required
          >
            <option value="">Select project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="task-due-date">Due date</Label>
          <Input
            id="task-due-date"
            type="date"
            value={form.due_date}
            onChange={(event) => setForm((prev) => ({ ...prev, due_date: event.target.value }))}
          />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="task-priority">Priority</Label>
          <select
            id="task-priority"
            className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:border-zinc-800 dark:bg-zinc-950"
            value={form.priority}
            onChange={(event) => setForm((prev) => ({ ...prev, priority: event.target.value }))}
          >
            {priorityOptions.map((priority) => (
              <option key={priority} value={priority}>
                {priority.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="task-status">Status</Label>
          <select
            id="task-status"
            className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:border-zinc-800 dark:bg-zinc-950"
            value={form.status}
            onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="task-assignee">Assignee ID (optional)</Label>
          <Input
            id="task-assignee"
            value={form.assignee}
            onChange={(event) => setForm((prev) => ({ ...prev, assignee: event.target.value }))}
            placeholder="User ID"
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!canSubmit || loading}>
          {loading ? "Saving..." : initialTask ? "Save changes" : "Create task"}
        </Button>
      </div>
    </form>
  );
};
