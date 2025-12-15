"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/auth-store";
import { useLogout } from "@/lib/hooks/useAuth";

const nav = [
  { label: "Overview", href: "/dashboard" },
  { label: "Projects", href: "/dashboard/projects" },
  { label: "Tasks", href: "/dashboard/tasks" },
  { label: "Profile", href: "/dashboard/profile" },
];

export const DashboardNavbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();
  const logout = useLogout();
  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/20 bg-gradient-to-r from-zinc-950 via-slate-900 to-zinc-900 px-4 py-4 text-white shadow-lg shadow-black/20 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-4">
        <div className="flex flex-1 items-center gap-3">
          <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.4em]">
            Taskoria
          </div>
          <p className="text-sm text-white/60">Enterprise Control Center</p>
        </div>
        <nav className="flex flex-wrap gap-3 text-sm">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 font-medium transition",
                  active ? "bg-white text-zinc-900" : "text-white/75 hover:bg-white/10"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            className="gap-2 rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20"
            onClick={() => router.push("/dashboard/projects")}
          >
            <Plus className="h-4 w-4" />
            New project
          </Button>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
            <Avatar
              name={user?.username}
              src={user?.avatar ?? undefined}
              className="h-8 w-8 border border-white/30 bg-white/20 text-white"
            />
            <div>
              <p className="text-xs font-semibold">{user?.username}</p>
              <p className="text-[10px] uppercase tracking-wide text-white/60">{user?.role}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
