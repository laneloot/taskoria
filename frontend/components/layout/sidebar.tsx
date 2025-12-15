"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/auth-store";
import { useLogout } from "@/lib/hooks/useAuth";

const navItems = [
  { label: "Overview", href: "/dashboard" },
  { label: "Projects", href: "/dashboard/projects" },
  { label: "Tasks", href: "/dashboard/tasks" },
  { label: "Analytics", href: "/dashboard#analytics" },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();
  const logout = useLogout();

  const initials = useMemo(() => user?.username?.slice(0, 2).toUpperCase(), [user?.username]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className="hidden h-full w-64 flex-col justify-between border-r border-zinc-100 bg-white/80 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 lg:flex">
      <div className="space-y-8">
        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-500">Workspace</p>
          <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Taskoria HQ</p>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const [basePath] = item.href.split("#");
            const isAnchor = item.href.includes("#");
            const active = isAnchor
              ? pathname === basePath
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800",
                  active ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800/70 dark:text-white" : undefined
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-zinc-100 p-3 dark:border-zinc-800">
        <Avatar name={user?.username} className="h-12 w-12 text-base">
          {initials}
        </Avatar>
        <div className="flex-1 text-sm">
          <p className="font-semibold text-zinc-900 dark:text-zinc-50">{user?.username}</p>
          <p className="text-xs capitalize text-zinc-500">{user?.role}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          Sign out
        </Button>
      </div>
    </aside>
  );
};
