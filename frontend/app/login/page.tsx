"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoginForm } from "@/components/forms/login-form";
import { useAuthStore } from "@/lib/store/auth-store";

const heroImage = "https://images.unsplash.com/photo-1531497865144-0464ef8fb9a3?auto=format&fit=crop&w=1200&q=80";

export default function LoginPage() {
  const router = useRouter();
  const hydrate = useAuthStore((state) => state.hydrate);
  const hydrated = useAuthStore((state) => state.hydrated);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (hydrated && accessToken) {
      router.replace("/dashboard");
    }
  }, [hydrated, accessToken, router]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-zinc-950 via-slate-950 to-black text-white">
      <div className="hidden flex-1 flex-col justify-between border-r border-white/10 p-12 lg:flex">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.4em] text-white/70">Taskoria</p>
          <h1 className="text-4xl font-semibold leading-tight">Orchestrate delivery, in one command center.</h1>
          <p className="text-sm text-white/80">
            Access analytics, projects, and task intelligence that stay perfectly in sync with your Django backend.
          </p>
        </div>
        <div
          className="relative h-64 rounded-3xl border border-white/20 bg-cover bg-center shadow-2xl shadow-black/50"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/70 to-black/20" />
          <div className="absolute bottom-6 left-6">
            <p className="text-xs uppercase tracking-[0.4em] text-white/70">Enterprise insights</p>
            <p className="text-2xl font-semibold">Strategic alignment, visualized.</p>
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-black/40 p-8 shadow-2xl shadow-black/40 backdrop-blur">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Sign in</p>
            <h2 className="text-3xl font-semibold">Welcome back.</h2>
            <p className="text-sm text-white/70">
              Need an account?{" "}
              <Link href="/register" className="font-semibold underline">
                Create one
              </Link>
              .
            </p>
          </div>
          <div className="mt-8">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
