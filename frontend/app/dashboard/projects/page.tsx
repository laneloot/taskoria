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
import { ProjectsSection } from "@/components/dashboard/projects-section";
import { ProjectForm } from "@/components/dashboard/project-form";
import { Button } from "@/components/ui/button";
import { Modal, ConfirmDialog } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import {
  createProject,
  deleteProject,
  fetchProjects,
  fetchUsers,
  updateProject,
} from "@/lib/api/endpoints";
import { useAuthGuard } from "@/lib/hooks/useAuthGuard";
import { useProfileQuery } from "@/lib/hooks/useAuth";
import { Project, ProjectPayload } from "@/lib/types";

const statusFilters: Array<"all" | Project["status"]> = ["all", "planning", "active", "completed", "archived"];
const projectsHeroImage = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80";

const getErrorMessage = (error: unknown) =>
  error && typeof error === "object" && "message" in error && typeof (error as { message?: string }).message === "string"
    ? (error as { message?: string }).message ?? "Something went wrong."
    : "Something went wrong. Please try again.";

export default function ProjectsPage() {
  const queryClient = useQueryClient();
  const { hydrated, accessToken } = useAuthGuard();
  const queriesEnabled = hydrated && Boolean(accessToken);
  useProfileQuery(queriesEnabled);

  const [status, setStatus] = useState<"all" | Project["status"]>("all");
  const [projectModal, setProjectModal] = useState<{ mode: "create" | "edit"; project?: Project } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmProject, setConfirmProject] = useState<Project | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  const projectsQuery = useQuery({
    queryKey: ["projects-page", status],
    queryFn: () =>
      fetchProjects({
        limit: 40,
        status: status === "all" ? undefined : status,
      }),
    enabled: queriesEnabled,
  });

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers({ limit: 200 }),
    enabled: queriesEnabled,
    staleTime: 5 * 60 * 1000,
  });

  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects-page"] }),
  });

  const updateProjectMutation = useMutation({
    mutationFn: ({ projectId, payload }: { projectId: number; payload: ProjectPayload }) =>
      updateProject(projectId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects-page"] }),
  });

  const deleteProjectMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects-page"] }),
  });

  if (!hydrated) {
    return <CenteredMessage message="Preparing your workspace…" />;
  }

  if (!accessToken) {
    return <CenteredMessage message="Redirecting you to sign in…" />;
  }

  const projects = projectsQuery.data?.results ?? [];
  const users = usersQuery.data ?? [];
  const usersError = usersQuery.error ? getErrorMessage(usersQuery.error) : null;
  const saving = createProjectMutation.isPending || updateProjectMutation.isPending;
  const confirmLoading = deleteProjectMutation.isPending;

  const openModal = (mode: "create" | "edit", project?: Project) => {
    setFormError(null);
    setProjectModal({ mode, project });
  };

  const closeModal = () => {
    setProjectModal(null);
    setFormError(null);
  };

  const handleSubmit = async (payload: ProjectPayload) => {
    if (!projectModal) return;
    try {
      if (projectModal.mode === "create") {
        await createProjectMutation.mutateAsync(payload);
      } else if (projectModal.project) {
        await updateProjectMutation.mutateAsync({ projectId: projectModal.project.id, payload });
      }
      closeModal();
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  };

  const handleDelete = async () => {
    if (!confirmProject) return;
    try {
      setConfirmError(null);
      await deleteProjectMutation.mutateAsync(confirmProject.id);
      setConfirmProject(null);
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
      <div className="grid gap-6 rounded-4xl border border-white/10 bg-white/10 p-6 text-white shadow-2xl shadow-black/30 backdrop-blur lg:grid-cols-[1.2fr,0.8fr]">
        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/70">Projects</p>
            <h1 className="text-3xl font-semibold text-white">Portfolio overview</h1>
            <p className="text-sm text-white/80">
              Manage scopes, staffing, and progress across every project in the workspace.
            </p>
          </div>
          <Button className="gap-2 rounded-full bg-white text-zinc-900 hover:bg-slate-100" onClick={() => openModal("create")}>
            <Plus className="h-4 w-4" />
            New project
          </Button>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
              <Filter className="h-4 w-4" />
              Status filter
            </div>
            <div className="flex flex-wrap gap-3">
              {statusFilters.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setStatus(option)}
                  className={filterChipClasses(status === option)}
                >
                  {option === "all" ? "All statuses" : option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div
          className="rounded-3xl border border-white/20 bg-cover bg-center shadow-xl shadow-black/40"
          style={{ backgroundImage: `url(${projectsHeroImage})` }}
        >
          <div className="flex h-full flex-col justify-end rounded-3xl bg-gradient-to-t from-black/70 to-black/10 p-6 text-white">
            <p className="text-xs uppercase tracking-[0.3em] text-white/70">Delivery squads</p>
            <p className="text-lg font-semibold">Weekly runway snapshots</p>
          </div>
        </div>
      </div>

      {projectsQuery.error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">
          <p>Unable to load projects. Refresh once the API is reachable.</p>
          <p className="text-xs text-red-500">Details: {getErrorMessage(projectsQuery.error)}</p>
        </div>
      )}

      {projectsQuery.isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      ) : (
        <ProjectsSection
          title="All projects"
          description="Drill into each initiative, update members, or archive work as needed."
          projects={projects}
          onCreate={() => openModal("create")}
          onEdit={(project) => openModal("edit", project)}
          onDelete={setConfirmProject}
        />
      )}

      <Modal
        open={Boolean(projectModal)}
        onClose={closeModal}
        title={projectModal?.mode === "create" ? "Create project" : "Edit project"}
        description="Adjust scope, timeline, and membership."
      >
        <ProjectForm
          key={projectModal?.project ? `project-${projectModal.project.id}` : "project-new"}
          initialProject={projectModal?.project}
          loading={saving}
          error={formError}
          users={users}
          loadingUsers={usersQuery.isLoading}
          usersError={usersError}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(confirmProject)}
        onCancel={() => {
          setConfirmProject(null);
          setConfirmError(null);
        }}
        onConfirm={handleDelete}
        loading={confirmLoading}
        title="Delete project"
        description={`"${confirmProject?.name ?? ""}" will be permanently removed.`}
        confirmLabel="Delete"
      >
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          This action cannot be undone. Associated tasks remain stored but will lose their parent link.
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
