"use client";

import { useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { Plus, Sparkles } from "lucide-react";

import { OverviewCards } from "@/components/dashboard/overview-cards";
import { ProjectsSection } from "@/components/dashboard/projects-section";
import { TasksSection } from "@/components/dashboard/tasks-section";
import { AnalyticsSection } from "@/components/dashboard/analytics-section";
import { ActivitySection } from "@/components/dashboard/activity-section";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Modal, ConfirmDialog } from "@/components/ui/modal";
import { TaskForm } from "@/components/dashboard/task-form";
import { ProjectForm } from "@/components/dashboard/project-form";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Topbar } from "@/components/layout/topbar";
import {
  fetchNotifications,
  fetchProjects,
  fetchTaskDistribution,
  fetchTasks,
  fetchUserSummary,
  fetchWeeklyProductivity,
  markAllNotificationsRead,
  createProject,
  updateProject,
  deleteProject,
  createTask,
  updateTask,
  deleteTask,
  fetchUsers,
} from "@/lib/api/endpoints";
import { useAuthStore } from "@/lib/store/auth-store";
import { useProfileQuery } from "@/lib/hooks/useAuth";
import { useAuthGuard } from "@/lib/hooks/useAuthGuard";
import { Project, ProjectPayload, Task, TaskPayload } from "@/lib/types";

const heroImages = [
  "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1487611459768-bd414656ea10?auto=format&fit=crop&w=600&q=80",
];

const spotlightCards = [
  {
    title: "Global launch readiness",
    description: "Track dependencies, risk, and cross-team accountability ahead of every release.",
    image: "https://images.unsplash.com/photo-1472289065668-ce650ac443d2?auto=format&fit=crop&w=600&q=80",
    category: "Programs",
  },
  {
    title: "Intelligent prioritization",
    description: "Surface urgent tasks, align resourcing, and keep commitments transparent.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80",
    category: "Insights",
  },
  {
    title: "Team health snapshots",
    description: "Visualize sentiment and workload across pods to intervene before bottlenecks.",
    image: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=600&q=80",
    category: "Culture",
  },
];

const getErrorMessage = (error: unknown) =>
  error && typeof error === "object" && "message" in error && typeof (error as { message?: string }).message === "string"
    ? (error as { message?: string }).message ?? "Something went wrong."
    : "Something went wrong. Please try again.";

const viewOnlyDashboard = process.env.NEXT_PUBLIC_VIEW_ONLY_DASHBOARD !== "false";

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const { hydrated, accessToken } = useAuthGuard();
  const user = useAuthStore((state) => state.user);
  const [taskModal, setTaskModal] = useState<{ mode: "create" | "edit"; task?: Task } | null>(null);
  const [projectModal, setProjectModal] = useState<{ mode: "create" | "edit"; project?: Project } | null>(null);
  const [taskError, setTaskError] = useState<string | null>(null);
  const [projectError, setProjectError] = useState<string | null>(null);
  const [confirmState, setConfirmState] = useState<{ type: "task" | "project"; id: number; name: string } | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  const queriesEnabled = hydrated && Boolean(accessToken);
  useProfileQuery(queriesEnabled);

  const projectsQuery = useQuery({
    queryKey: ["projects", { limit: 50 }],
    queryFn: () => fetchProjects({ limit: 50 }),
    enabled: queriesEnabled,
  });

  const tasksQuery = useQuery({
    queryKey: ["tasks", { limit: 10 }],
    queryFn: () => fetchTasks({ limit: 10 }),
    enabled: queriesEnabled,
  });

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    enabled: queriesEnabled,
    staleTime: 5 * 60 * 1000,
  });

  const notificationsQuery = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    enabled: queriesEnabled,
  });

  const summaryQuery = useQuery({
    queryKey: ["user-summary"],
    queryFn: fetchUserSummary,
    enabled: queriesEnabled,
  });

  const distributionQuery = useQuery({
    queryKey: ["task-distribution"],
    queryFn: () => fetchTaskDistribution(),
    enabled: queriesEnabled,
  });

  const productivityQuery = useQuery({
    queryKey: ["weekly-productivity", user?.id ?? "current"],
    queryFn: () => fetchWeeklyProductivity(user?.id),
    enabled: queriesEnabled && Boolean(user?.id),
  });

  const markAllMutation = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const refreshDashboard = () => {
    queryClient.invalidateQueries({ queryKey: ["projects"] });
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
    queryClient.invalidateQueries({ queryKey: ["user-summary"] });
    queryClient.invalidateQueries({ queryKey: ["task-distribution"] });
    queryClient.invalidateQueries({ queryKey: ["weekly-productivity"] });
  };

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: refreshDashboard,
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, payload }: { taskId: number; payload: TaskPayload }) => updateTask(taskId, payload),
    onSuccess: refreshDashboard,
  });

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: refreshDashboard,
  });

  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: refreshDashboard,
  });

  const updateProjectMutation = useMutation({
    mutationFn: ({ projectId, payload }: { projectId: number; payload: ProjectPayload }) => updateProject(projectId, payload),
    onSuccess: refreshDashboard,
  });

  const deleteProjectMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: refreshDashboard,
  });

  const isBootstrapping =
    summaryQuery.isLoading ||
    projectsQuery.isLoading ||
    tasksQuery.isLoading ||
    distributionQuery.isLoading ||
    notificationsQuery.isLoading ||
    (productivityQuery.isLoading && Boolean(user?.id));

  const firstError =
    (summaryQuery.error as Error | undefined) ||
    (projectsQuery.error as Error | undefined) ||
    (tasksQuery.error as Error | undefined) ||
    (distributionQuery.error as Error | undefined) ||
    (notificationsQuery.error as Error | undefined) ||
    (productivityQuery.error as Error | undefined);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <p className="text-sm text-zinc-500">Preparing your workspace…</p>
      </div>
    );
  }

  if (!accessToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <p className="text-sm text-zinc-500">Redirecting you to sign in…</p>
      </div>
    );
  }

  const projects = projectsQuery.data?.results ?? [];
  const tasks = tasksQuery.data?.results ?? [];
  const notifications = notificationsQuery.data?.results ?? [];
  const users = usersQuery.data ?? [];
  const usersError = usersQuery.error ? getErrorMessage(usersQuery.error) : null;
  const visibleProjects = projects.slice(0, 6);
  const hasProjects = projects.length > 0;
  const taskSaving = createTaskMutation.isPending || updateTaskMutation.isPending;
  const projectSaving = createProjectMutation.isPending || updateProjectMutation.isPending;
  const confirmLoading =
    confirmState?.type === "task" ? deleteTaskMutation.isPending : deleteProjectMutation.isPending;

  const closeTaskModal = () => {
    setTaskModal(null);
    setTaskError(null);
  };

  const closeProjectModal = () => {
    setProjectModal(null);
    setProjectError(null);
  };

  const closeConfirmDialog = () => {
    setConfirmState(null);
    setConfirmError(null);
  };

  const openTaskModal = (mode: "create" | "edit", task?: Task) => {
    if (viewOnlyDashboard) return;
    setTaskError(null);
    setTaskModal({ mode, task });
  };

  const openProjectModal = (mode: "create" | "edit", project?: Project) => {
    if (viewOnlyDashboard) return;
    setProjectError(null);
    setProjectModal({ mode, project });
  };

  const handleTaskSubmit = async (payload: TaskPayload) => {
    if (!taskModal) return;
    try {
      setTaskError(null);
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

  const handleProjectSubmit = async (payload: ProjectPayload) => {
    if (!projectModal) return;
    try {
      setProjectError(null);
      if (projectModal.mode === "create") {
        await createProjectMutation.mutateAsync(payload);
      } else if (projectModal.project) {
        await updateProjectMutation.mutateAsync({ projectId: projectModal.project.id, payload });
      }
      closeProjectModal();
    } catch (error) {
      setProjectError(getErrorMessage(error));
    }
  };

  const requestTaskDeletion = (task: Task) => {
    if (viewOnlyDashboard) return;
    setConfirmError(null);
    setConfirmState({ type: "task", id: task.id, name: task.title });
  };

  const requestProjectDeletion = (project: Project) => {
    if (viewOnlyDashboard) return;
    setConfirmError(null);
    setConfirmState({ type: "project", id: project.id, name: project.name });
  };

  const handleConfirmDelete = async () => {
    if (!confirmState) return;
    try {
      setConfirmError(null);
      if (confirmState.type === "task") {
        await deleteTaskMutation.mutateAsync(confirmState.id);
      } else {
        await deleteProjectMutation.mutateAsync(confirmState.id);
      }
      closeConfirmDialog();
    } catch (error) {
      setConfirmError(getErrorMessage(error));
    }
  };

  return (
    <DashboardShell>
      <Topbar />
      {firstError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">
          <p>We couldn&apos;t reach the API. Please ensure the Django server is running and reload.</p>
          <p className="text-xs text-red-500">Details: {firstError.message}</p>
        </div>
      )}
      {isBootstrapping ? (
        <DashboardSkeleton />
      ) : (
        <>
          <OverviewCards summary={summaryQuery.data} />
          <div className="grid gap-6 rounded-4xl border border-white/10 bg-white/10 p-8 text-white shadow-2xl shadow-black/40 backdrop-blur lg:grid-cols-[1.2fr,0.8fr]">
            <div className="space-y-5">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
                <Sparkles className="h-4 w-4 text-amber-300" />
                Executive view
              </span>
              <h2 className="text-3xl font-semibold leading-tight">
                Orchestrate delivery with confidence and clarity.
              </h2>
              <p className="text-sm text-white/80">
                Curated dashboards, rich analytics, and unified collaboration keep every initiative on track - powered by
                your Django backend.
              </p>
              {viewOnlyDashboard ? (
                <div className="rounded-3xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white/80">
                  View-only mode is enabled. Manage projects and tasks from the Django admin or API, then refresh to
                  see the latest data here.
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap gap-3">
                    <Button className="gap-2 rounded-full bg-white text-zinc-900 hover:bg-slate-100" onClick={() => openProjectModal("create")}>
                      <Plus className="h-4 w-4" />
                      Launch project
                    </Button>
                    <Button
                      variant="secondary"
                      className="gap-2 rounded-full border border-white/30 bg-transparent text-white hover:bg-white/10"
                      disabled={!hasProjects}
                      onClick={() => hasProjects && openTaskModal("create")}
                    >
                      <Plus className="h-4 w-4" />
                      Capture task
                    </Button>
                  </div>
                  {!hasProjects && (
                    <p className="text-xs text-amber-200">
                      Add at least one project to unlock task creation.
                    </p>
                  )}
                </>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {heroImages.map((src, index) => (
                <div
                  key={src}
                  className="relative h-32 rounded-3xl border border-white/20 bg-cover bg-center shadow-lg shadow-black/30"
                  style={{ backgroundImage: `url(${src})` }}
                >
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/60 to-black/5" />
                  <div className="absolute bottom-3 left-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
                    {index === 0 ? "Strategy" : index === 1 ? "Innovation" : "Teamwork"}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {spotlightCards.map((card) => (
              <div
                key={card.title}
                className="space-y-3 rounded-3xl border border-white/10 bg-white/10 p-5 text-white shadow-lg shadow-black/30 backdrop-blur"
              >
                <div
                  className="h-32 rounded-2xl border border-white/20 bg-cover bg-center"
                  style={{ backgroundImage: `url(${card.image})` }}
                />
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">{card.category}</p>
                <h3 className="text-lg font-semibold">{card.title}</h3>
                <p className="text-sm text-white/70">{card.description}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-6 xl:grid-cols-[2fr,1fr]">
            <div className="space-y-6">
              <ProjectsSection
                projects={visibleProjects}
                description={
                  viewOnlyDashboard
                    ? "Live sync with your Django API. Editing is disabled in this view-only workspace."
                    : undefined
                }
                onCreate={!viewOnlyDashboard ? () => openProjectModal("create") : undefined}
                onEdit={!viewOnlyDashboard ? (project) => openProjectModal("edit", project) : undefined}
                onDelete={!viewOnlyDashboard ? (project) => requestProjectDeletion(project) : undefined}
              />
              <TasksSection
                tasks={tasks}
                description={
                  viewOnlyDashboard
                    ? "Review task assignments and progress. Task creation and editing are disabled in this workspace."
                    : undefined
                }
                onCreate={!viewOnlyDashboard && hasProjects ? () => openTaskModal("create") : undefined}
                onEdit={!viewOnlyDashboard ? (task) => openTaskModal("edit", task) : undefined}
                onDelete={!viewOnlyDashboard ? (task) => requestTaskDeletion(task) : undefined}
              />
            </div>
            <div className="space-y-6">
              <AnalyticsSection
                distribution={distributionQuery.data}
                weeklyTrend={productivityQuery.data}
              />
              <ActivitySection
                notifications={notifications}
                onMarkAllRead={() => markAllMutation.mutate()}
              />
            </div>
          </div>
        </>
      )}
      {!viewOnlyDashboard && (
        <>
          <Modal
            open={Boolean(taskModal)}
            onClose={closeTaskModal}
            title={taskModal?.mode === "create" ? "Create task" : "Edit task"}
            description="Capture work directly against your Django-powered backlog."
          >
            <TaskForm
              key={taskModal?.task ? `task-${taskModal.task.id}` : "task-new"}
              projects={projects}
              initialTask={taskModal?.task}
              loading={taskSaving}
              error={taskError}
              onSubmit={handleTaskSubmit}
              onCancel={closeTaskModal}
            />
          </Modal>
          <Modal
            open={Boolean(projectModal)}
            onClose={closeProjectModal}
            title={projectModal?.mode === "create" ? "Create project" : "Edit project"}
            description="Define the scope, timeline, and team members for your initiative."
          >
            <ProjectForm
              key={projectModal?.project ? `project-${projectModal.project.id}` : "project-new"}
              initialProject={projectModal?.project}
              loading={projectSaving}
              error={projectError}
              users={users}
              loadingUsers={usersQuery.isLoading}
              usersError={usersError}
              onSubmit={handleProjectSubmit}
              onCancel={closeProjectModal}
            />
          </Modal>
          <ConfirmDialog
            open={Boolean(confirmState)}
            onCancel={closeConfirmDialog}
            onConfirm={handleConfirmDelete}
            loading={confirmLoading}
            title={
              confirmState?.type === "task" ? "Delete task" : "Delete project"
            }
            description={`"${confirmState?.name ?? ""}" will be permanently removed.`}
            confirmLabel="Delete"
          >
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              This action cannot be undone. Any related dashboards will refresh automatically.
            </p>
            {confirmError && <p className="mt-3 text-sm text-red-600">{confirmError}</p>}
          </ConfirmDialog>
        </>
      )}
    </DashboardShell>
  );
}

const DashboardSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="h-44 w-full rounded-3xl" />
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-32 w-full rounded-2xl" />
      ))}
    </div>
    <div className="grid gap-6 xl:grid-cols-[2fr,1fr]">
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <Skeleton key={index} className="h-48 w-full rounded-3xl" />
        ))}
      </div>
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <Skeleton key={index} className="h-56 w-full rounded-3xl" />
        ))}
      </div>
    </div>
  </div>
);
