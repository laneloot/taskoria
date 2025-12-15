"use client";

import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiUser, Project, ProjectPayload } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusOptions: Project["status"][] = ["planning", "active", "completed", "archived"];

interface ProjectFormProps {
  initialProject?: Project;
  loading?: boolean;
  error?: string | null;
  users: ApiUser[];
  loadingUsers?: boolean;
  usersError?: string | null;
  onSubmit: (payload: ProjectPayload) => Promise<void> | void;
  onCancel: () => void;
}

export const ProjectForm = ({
  initialProject,
  loading,
  error,
  users,
  loadingUsers = false,
  usersError,
  onSubmit,
  onCancel,
}: ProjectFormProps) => {
  const today = new Date().toISOString().slice(0, 10);
  const isEditing = Boolean(initialProject);
  const [form, setForm] = useState(() => ({
    name: initialProject?.name ?? "",
    description: initialProject?.description ?? "",
    status: initialProject?.status ?? "planning",
    start_date: initialProject?.start_date?.slice(0, 10) ?? today,
    end_date: initialProject?.end_date ? initialProject.end_date.slice(0, 10) : "",
    members: initialProject?.members ?? [],
  }));

  const canSubmit = useMemo(
    () => form.name.trim().length > 0 && form.start_date.trim().length > 0,
    [form.name, form.start_date]
  );

  const toggleMember = (userId: number) => {
    setForm((prev) => {
      const exists = prev.members.includes(userId);
      const nextMembers = exists ? prev.members.filter((id) => id !== userId) : [...prev.members, userId];
      return { ...prev, members: nextMembers };
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;

    const payload: ProjectPayload = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      status: isEditing ? form.status : "planning",
      start_date: form.start_date,
      end_date: form.end_date || null,
      members: form.members,
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="project-name">Name</Label>
        <Input
          id="project-name"
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          placeholder="Unified Billing Experience"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="project-description">Description</Label>
        <Textarea
          id="project-description"
          rows={4}
          value={form.description}
          onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
          placeholder="Highlight goals, KPIs, and coordination notes."
        />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="project-status">Status</Label>
          <select
            id="project-status"
            className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950"
            value={form.status}
            disabled={!isEditing}
            onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
          {!isEditing && (
            <p className="text-xs text-zinc-500">
              New projects always begin in Planning - you can update the status later.
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="project-start">Start date</Label>
          <Input
            id="project-start"
            type="date"
            value={form.start_date}
            onChange={(event) => setForm((prev) => ({ ...prev, start_date: event.target.value }))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="project-end">End date</Label>
          <Input
            id="project-end"
            type="date"
            value={form.end_date}
            onChange={(event) => setForm((prev) => ({ ...prev, end_date: event.target.value }))}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Members</Label>
        {loadingUsers ? (
          <Skeleton className="h-24 w-full rounded-2xl" />
        ) : usersError ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            <p>We couldn&apos;t load teammates right now.</p>
            <p className="text-xs">You can still create the project and add members later.</p>
          </div>
        ) : users.length === 0 ? (
          <p className="text-sm text-zinc-500">No teammates found. Create users first or add members later.</p>
        ) : (
          <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
            {users.map((user) => {
              const selected = form.members.includes(user.id);
              return (
                <button
                  key={`member-${user.id}`}
                  type="button"
                  onClick={() => toggleMember(user.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition",
                    selected
                      ? "border-zinc-900 bg-zinc-900 text-white shadow-md"
                      : "border-zinc-200 bg-white hover:border-zinc-400"
                  )}
                >
                  <div>
                    <p className="text-sm font-semibold">{user.username}</p>
                    <p className={cn("text-xs", selected ? "text-white/70" : "text-zinc-500")}>{user.email}</p>
                  </div>
                  {selected && <Check className="h-4 w-4" />}
                </button>
              );
            })}
          </div>
        )}
        <p className="text-xs text-zinc-500">
          Select teammates by name; Taskoria maps them to the correct IDs for you.
        </p>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!canSubmit || loading}>
          {loading ? "Saving..." : initialProject ? "Update project" : "Create project"}
        </Button>
      </div>
    </form>
  );
};
