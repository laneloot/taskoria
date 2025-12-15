"use client";

import { ReactNode } from "react";
import { DashboardNavbar } from "@/components/layout/dashboard-navbar";

interface DashboardShellProps {
  children: ReactNode;
}

export const DashboardShell = ({ children }: DashboardShellProps) => (
  <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-slate-950">
    <DashboardNavbar />
    <main className="px-4 py-8 md:px-10">
      <div className="mx-auto w-full max-w-6xl space-y-8 pb-16">{children}</div>
    </main>
  </div>
);
