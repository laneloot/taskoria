"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { RegisterForm } from "@/components/forms/register-form";
import { useAuthStore } from "@/lib/store/auth-store";

const registerHero = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80";

export default function RegisterPage() {
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
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-950 via-zinc-900 to-black text-white lg:flex-row">
      <div className="flex flex-1 flex-col justify-center gap-8 border-r border-white/10 px-10 py-16">
        <p className="text-xs uppercase tracking-[0.4em] text-white/70">Launch faster</p>
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold leading-tight">Spin up a modern UI.</h1>
          <p className="text-sm text-white/80">
            Taskoria delivers prebuilt analytics, project overviews, and team insights that stay in sync with your backend.
          </p>
          <p className="text-sm text-white/60">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold underline">
              Sign in
            </Link>
            .
          </p>
        </div>
        <div
          className="hidden h-64 rounded-3xl border border-white/20 bg-cover bg-center shadow-2xl shadow-black/40 lg:block"
          style={{ backgroundImage: `url(${registerHero})` }}
        >
          <div className="flex h-full flex-col justify-end rounded-3xl bg-gradient-to-t from-black/70 to-black/10 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-white/70">Collaboration</p>
            <p className="text-lg font-semibold">Run every program, together.</p>
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-black/40 p-8 shadow-2xl shadow-black/40 backdrop-blur">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Create workspace</p>
            <h2 className="text-3xl font-semibold">Start building.</h2>
            <p className="text-sm text-white/70">Connect your Django API and invite your team in minutes.</p>
          </div>
          <div className="mt-8">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
}
