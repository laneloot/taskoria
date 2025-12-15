"use client";

import { useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Filter, Plus } from "lucide-react";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Topbar } from "@/components/layout/topbar";
import { TasksSection } from "@/components/dashboard/tasks-section";
import { TaskForm } from "@/components/dashboard/task-form";
import { Button } from "@/components/ui/button";
import { Modal, ConfirmDialog } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import {
  createTask,
  deleteTask,
  fetchProjects,
  fetchTasks,
  updateTask,
} from "@/lib/api/endpoints";
import { useAuthGuard } from "@/lib/hooks/useAuthGuard";
import { useProfileQuery } from "@/lib/hooks/useAuth";
import { Task, TaskPayload } from "@/lib/types";

const statusFilters: Array<"all" | Task["status"]> = ["all", "todo", "in_progress", "done", "blocked"];
const priorityFilters: Array<"all" | Task["priority"]> = ["all", "low", "medium", "high"];
const tasksHeroImage = "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80";

const getErrorMessage = (error: unknown) =>
  error && typeof error === "object" && "message" in error && typeof (error as { message?: string }).message === "string"
    ? (error as { message?: string }).message ?? "Something went wrong."
    : "Something went wrong. Please try again.";

export default function TasksPage() {
  const queryClient = useQueryClient();
  const { hydrated, accessToken } = useAuthGuard();
  const queriesEnabled = hydrated && Boolean(accessToken);
  useProfileQuery(queriesEnabled);

  const [filters, setFilters] = useState<{ status: "all" | Task["status"]; priority: "all" | Task["priority"] }>({
    status: "all",
    priority: "all",
  });
  const [taskModal, setTaskModal] = useState<{ mode: "create" | "edit"; task?: Task } | null>(null);
  const [taskError, setTaskError] = useState<string | null>(null);
  const [confirmState, setConfirmState] = useState<Task | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  const tasksQuery = useQuery({
    queryKey: ["tasks-page", filters],
    queryFn: () =>
      fetchTasks({
        limit: 30,
        status: filters.status === "all" ? undefined : filters.status,
        priority: filters.priority === "all" ? undefined : filters.priority,
      }),
    enabled: queriesEnabled,
  });

  const projectsQuery = useQuery({
    queryKey: ["projects", { limit: 100 }],
    queryFn: () => fetchProjects({ limit: 100 }),
    enabled: queriesEnabled,
  });

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks-page"] }),
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, payload }: { taskId: number; payload: TaskPayload }) => updateTask(taskId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks-page"] }),
  });

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks-page"] }),
  });

  if (!hydrated) {
    return <CenteredMessage message="Preparing your workspace…" />;
  }

  if (!accessToken) {
    return <CenteredMessage message="Redirecting you to sign in…" />;
  }

  const tasks = tasksQuery.data?.results ?? [];
  const projects = projectsQuery.data?.results ?? [];
  const canCreateTask = projects.length > 0;
  const mutationPending = createTaskMutation.isPending || updateTaskMutation.isPending;
  const confirmLoading = deleteTaskMutation.isPending;

  const openTaskModal = (mode: "create" | "edit", task?: Task) => {
    setTaskError(null);
    setTaskModal({ mode, task });
  };

  const closeTaskModal = () => {
    setTaskModal(null);
    setTaskError(null);
  };

  const handleTaskSubmit = async (payload: TaskPayload) => {
    if (!taskModal) return;
    try {
      if (taskModal.mode === "create") {
        await createTaskMutation.mutateAsync(payload);
      } else if (taskModal.task) {
        await updateTaskMutation.mutateAsync({ taskId: taskModal.task.id, payload });
      }
      closeTaskModal();
    } catch (error) {
      setTaskError(getErrorMessage(error));
    }
  };

  const handleDelete = async () => {
    if (!confirmState) return;
    try {
      setConfirmError(null);
      await deleteTaskMutation.mutateAsync(confirmState.id);
      setConfirmState(null);
    } catch (error) {
      setConfirmError(getErrorMessage(error));
    }
  };

  const filterChipClasses = (active: boolean) =>
    [
      "rounded-full border px-3 py-1 text-xs font-medium transition",
      active
        ? "border-white bg-white text-zinc-900"
        : "border-white/40 text-white/70 hover:border-white/80 hover:text-white",
    ].join(" ");

  return (
    <DashboardShell>
      <Topbar />
      <div className="grid gap-6 rounded-4xl border border-white/10 bg-white/10 p-6 text-white shadow-2xl shadow-black/30 backdrop-blur lg:grid-cols-[1.3fr,0.7fr]">
        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/70">Tasks</p>
            <h1 className="text-3xl font-semibold">Operational backlog</h1>
            <p className="text-sm text-white/80">
              Filter, triage, and edit every task synced from the Django API.
            </p>
          </div>
          <Button
            className="gap-2 rounded-full bg-white text-zinc-900 hover:bg-slate-100"
            disabled={!canCreateTask}
            onClick={() => canCreateTask && openTaskModal("create")}
          >
            <Plus className="h-4 w-4" />
            New task
          </Button>
          {!canCreateTask && (
            <p className="text-xs text-amber-200">
              Add at least one project before creating tasks.
            </p>
          )}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
              <Filter className="h-4 w-4" />
              Filters
            </div>
            <div className="flex flex-wrap gap-3">
              {statusFilters.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, status }))}
                  className={filterChipClasses(filters.status === status)}
                >
                  {status === "all" ? "All statuses" : status.replace("_", " ")}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              {priorityFilters.map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, priority }))}
                  className={filterChipClasses(filters.priority === priority)}
                >
                  {priority === "all" ? "All priorities" : priority.charAt(0).toUpperCase() + priority.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div
          className="rounded-3xl border border-white/20 bg-cover bg-center shadow-xl shadow-black/40"
          style={{ backgroundImage: `url(${tasksHeroImage})` }}
        >
          <div className="flex h-full flex-col justify-end rounded-3xl bg-gradient-to-t from-black/70 to-black/10 p-6 text-white">
            <p className="text-xs uppercase tracking-[0.3em] text-white/70">Live boards</p>
            <p className="text-lg font-semibold">Realtime Kanban snapshots</p>
          </div>
        </div>
      </div>

      {tasksQuery.error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">
          <p>Unable to load tasks. Refresh once the API is reachable.</p>
          <p className="text-xs text-red-500">Details: {getErrorMessage(tasksQuery.error)}</p>
        </div>
      )}

      {tasksQuery.isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
        </div>
      ) : (
        <TasksSection
          title="All tasks"
          description="Keep everything aligned - edit, reassign, or close tasks inline."
          tasks={tasks}
          onCreate={canCreateTask ? () => openTaskModal("create") : undefined}
          onEdit={(task) => openTaskModal("edit", task)}
          onDelete={(task) => setConfirmState(task)}
        />
      )}

      <Modal
        open={Boolean(taskModal)}
        onClose={closeTaskModal}
        title={taskModal?.mode === "create" ? "Create task" : "Edit task"}
        description="Update records directly - changes sync to Django instantly."
      >
        <TaskForm
          key={taskModal?.task ? `task-${taskModal.task.id}` : "task-new"}
          projects={projects}
          initialTask={taskModal?.task}
          loading={mutationPending}
          error={taskError}
          onSubmit={handleTaskSubmit}
          onCancel={closeTaskModal}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(confirmState)}
        onCancel={() => {
          setConfirmState(null);
          setConfirmError(null);
        }}
        onConfirm={handleDelete}
        loading={confirmLoading}
        title="Delete task"
        description={`"${confirmState?.title ?? ""}" will be permanently removed.`}
        confirmLabel="Delete"
      >
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          This action cannot be undone. Activity feeds will refresh automatically.
        </p>
        {confirmError && <p className="mt-3 text-sm text-red-600">{confirmError}</p>}
      </ConfirmDialog>
    </DashboardShell>
  );
}

const CenteredMessage = ({ message }: { message: string }) => (
  <div className="flex min-h-screen items-center justify-center bg-zinc-50">
    <p className="text-sm text-zinc-500">{message}</p>
  </div>
);
