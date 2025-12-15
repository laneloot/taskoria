"use client";

import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { useAuthStore } from "@/lib/store/auth-store";

export const Topbar = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 px-6 py-6 text-white shadow-2xl shadow-black/30 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/70">Welcome back</p>
          <h1 className="text-3xl font-semibold tracking-tight">
            {user ? `${user.username}'s Workspace` : "Taskoria Dashboard"}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="border-white/50 bg-white/10 text-white">
            {user?.role ?? "member"}
          </Badge>
          <Avatar
            name={user?.username}
            src={user?.avatar ?? undefined}
            className="h-12 w-12 border border-white/30 bg-white/10 text-white"
          />
        </div>
      </div>
      <p className="text-sm text-white/80">
        Track projects, tasks, and team performance with live insights from your Django backend.
      </p>
    </header>
  );
};
