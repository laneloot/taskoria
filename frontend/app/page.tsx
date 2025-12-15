import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BellRing,
  Layers,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    title: "Live project health",
    description:
      "Surface velocity, blockers, and risk across every project with a single API call to your Django backend.",
    icon: BarChart3,
  },
  {
    title: "Task orchestration",
    description:
      "Plan sprints, track statuses, and triage overdue work with the same data powering your REST endpoints.",
    icon: Layers,
  },
  {
    title: "Proactive alerts",
    description:
      "Deliver comment, assignment, and workflow notifications instantly through Channels and WebSockets.",
    icon: BellRing,
  },
  {
    title: "Enterprise-ready security",
    description:
      "Role-based access control, JWT authentication, and audit trails keep every workspace compliant.",
    icon: ShieldCheck,
  },
];

const stats = [
  { label: "Projects orchestrated", value: "40+" },
  { label: "Tasks automated", value: "12k" },
  { label: "Realtime notifications", value: "100%" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 via-slate-950 to-black text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16 lg:gap-24 lg:py-24">
        <section className="grid items-center gap-12 lg:grid-cols-[1.15fr,0.85fr]">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white/80">
              <Sparkles className="h-4 w-4 text-amber-400" />
              Django + Next.js platform
            </span>
            <div className="space-y-6">
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">Taskoria is your operational command center.</h1>
              <p className="text-lg text-white/70">
                Bring your Django REST API to life with a polished Next.js front-end. Collaborate on projects, orchestrate
                tasks, and visualize analytics in a single high-performance workspace.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full border border-white/80 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 shadow-[0_20px_80px_rgba(0,0,0,0.35)] transition hover:bg-white/90"
              >
                Enter dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/70"
              >
                Create workspace
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-white/60">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-semibold text-white">{stat.value}</p>
                  <p>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <Card className="relative overflow-hidden border border-white/10 bg-white/5 p-0 text-white shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
            <div className="absolute inset-0 opacity-40">
              <div className="absolute -right-16 -top-14 h-52 w-52 rounded-full bg-emerald-400/40 blur-3xl" />
              <div className="absolute -bottom-12 left-0 h-48 w-48 rounded-full bg-sky-500/40 blur-3xl" />
            </div>
            <div className="relative space-y-8 px-10 py-12">
              <p className="text-sm uppercase tracking-[0.3em] text-white/60">Live Preview</p>
              <h2 className="text-3xl font-semibold">Unified delivery pipeline</h2>
              <p className="text-sm text-white/70">
                View workload distribution, project roadmaps, and notification streams without leaving the dashboard.
              </p>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-wide text-white/60">Snapshot</p>
                <p className="text-2xl font-semibold text-white">98% tasks on track</p>
                <p className="mt-3 text-sm text-white/80">
                  Metrics are powered directly by Django, Celery, and Channels so your data never drifts.
                </p>
              </div>
            </div>
          </Card>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-3 text-center text-white lg:text-left">
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-white/50">Features</p>
            <h2 className="text-3xl font-semibold">Everything you ship in Django deserves a refined experience.</h2>
            <p className="text-lg text-white/70">
              Taskoria combines analytics, task management, and notifications into elegant UI modules that talk to your API.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="h-full border border-white/10 bg-white/5 shadow-[0_25px_70px_rgba(0,0,0,0.35)] transition hover:bg-white/10"
              >
                <CardHeader className="flex flex-row items-center gap-4">
                  <feature.icon className="h-10 w-10 rounded-full bg-white/10 p-2 text-white" />
                  <div>
                    <CardTitle className="text-base text-white">{feature.title}</CardTitle>
                    <CardDescription className="text-white/70">{feature.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-10 shadow-[0_40px_120px_rgba(0,0,0,0.45)] lg:grid-cols-2">
          <div className="space-y-4 text-white">
            <p className="text-sm uppercase tracking-[0.4em] text-white/50">Backend-first</p>
            <h3 className="text-3xl font-semibold">Designed for your Django stack.</h3>
            <p className="text-lg text-white/70">
              The dashboard consumes REST endpoints for projects, tasks, analytics, notifications, and authentication.
              Plug it into any Django deployment, tune the base URL, and ship a professional client without rebuilding UI
              primitives from scratch.
            </p>
          </div>
          <Card className="border border-white/10 bg-black/30 shadow-[0_25px_80px_rgba(0,0,0,0.3)]">
            <CardHeader>
              <CardTitle className="text-white">Ready to dive in?</CardTitle>
              <CardDescription className="text-white/70">
                Connect your API credentials then explore the full experience.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Link
                href="/login"
                className="inline-flex flex-1 items-center justify-center rounded-lg border border-white/80 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 shadow-[0_25px_70px_rgba(0,0,0,0.35)] transition hover:bg-white/90"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="inline-flex flex-1 items-center justify-center rounded-lg border border-white/20 px-4 py-3 text-sm font-semibold text-white transition hover:border-white/60"
              >
                Create account
              </Link>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
