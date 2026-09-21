import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  AlertTriangle,
  MapPin,
  Shield,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ThumbsUp,
  Bot,
  Compass,
  Trophy,
  Droplets,
  BookOpen,
  Send,
  Eye,
  ShieldCheck,
  FileCheck2,
  Lock,
  Layers,
} from "lucide-react";
import { RainOverlay } from "@/components/RainOverlay";
import { FloodGuardLogo } from "@/components/FloodGuardLogo";
import { CountUp } from "@/components/CountUp";
import { DemoBadge } from "@/components/DemoBadge";
import { SeverityPill } from "@/components/SeverityPill";
import { CategoryPill } from "@/components/CategoryPill";
import { VerificationBadge } from "@/components/VerificationBadge";
import { StatusBadge } from "@/components/StatusBadge";
import {
  CATEGORIES,
  SAFETY_SECTIONS,
  CHALLENGE_TASKS,
  LEADERBOARD,
  type IncidentCategory,
  type IncidentReport,
} from "@/lib/floodguard-data";
import { useProgress } from "@/lib/progress";
import { useReports } from "@/lib/reports-context";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  component: Index,
});

export function Index() {
  const { points, addPoints, hasAction } = useProgress();
  const { reports, stats, confirmReport, setSelectedReportForDetail } = useReports();

  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>("all");

  const filteredFeed = reports.filter((r) => {
    if (selectedCategoryTab === "all") return true;
    return r.category === selectedCategoryTab;
  });

  const handleChallengeTask = (taskId: string) => {
    if (hasAction(taskId)) return;
    addPoints(5, taskId);
    toast.success("Action marked complete! +5 Community Hero points 🌟");
  };

  return (
    <div className="flex flex-col gap-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/10 via-background to-background py-14 lg:py-20">
        <RainOverlay className="opacity-30" />

        <div className="relative mx-auto max-w-7xl px-4">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="space-y-6 text-center lg:col-span-7 lg:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-extrabold text-primary">
                  <FloodGuardLogo size={16} /> TrustReport Ilorin
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/15 px-3 py-1 text-xs font-extrabold text-purple-700 dark:text-purple-300">
                  🛡️ OSF × Andela Hackathon: Information You Can Trust
                </span>
                <DemoBadge />
              </div>

              <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Community Incident Reporting & <span className="text-gradient">Verification</span>
              </h1>

              <p className="mx-auto max-w-2xl text-lg font-medium text-muted-foreground lg:mx-0">
                A transparent, community-driven platform for reporting, verifying, and tracking
                local hazards in Ilorin — from seasonal floods and drainage choke-points to
                infrastructure and electrical risks.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2 lg:justify-start">
                <Link
                  to="/report"
                  className="inline-flex items-center gap-2 rounded-2xl bg-destructive px-6 py-3.5 text-base font-extrabold text-destructive-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
                >
                  <AlertTriangle className="size-5" /> 🚨 Report an Incident
                </Link>

                <Link
                  to="/map"
                  className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-base font-extrabold text-primary-foreground shadow-md transition-transform hover:scale-105 active:scale-95"
                >
                  <Compass className="size-5" /> 🗺️ Incident Map & Safe Routes
                </Link>

                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 rounded-2xl border-2 border-primary/30 bg-card px-5 py-3.5 text-base font-bold text-foreground transition-colors hover:bg-accent"
                >
                  <FileCheck2 className="size-5 text-primary" /> 📊 Verification Ledger
                </Link>
              </div>

              {/* Tagline & Privacy pill */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2 lg:justify-start text-xs font-bold text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Lock className="size-3.5 text-primary" /> Responsible Data & Privacy First
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="size-3.5 text-emerald-500" /> Multi-Layer Verification
                </span>
              </div>
            </div>

            {/* Hero Visual Card / Interactive Ilorin Map Preview */}
            <div className="relative mx-auto w-full max-w-lg lg:col-span-5">
              <div className="relative overflow-hidden rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 p-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div className="flex items-center gap-2">
                    <span className="size-3 rounded-full bg-red-500" />
                    <span className="size-3 rounded-full bg-yellow-500" />
                    <span className="size-3 rounded-full bg-green-500" />
                  </div>
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                    Ilorin Incident Radar (Live Ledger)
                  </span>
                </div>

                {/* Stylized Ilorin map graphic with diverse category points */}
                <div className="relative my-4 aspect-[4/3] rounded-2xl bg-gradient-to-b from-sky-100 to-blue-50 dark:from-slate-800 dark:to-slate-900 p-4">
                  <RainOverlay className="opacity-25" />

                  {/* Advisory pill */}
                  <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/90 dark:bg-slate-800/90 px-3 py-1 shadow-sm backdrop-blur">
                    <Droplets className="size-3.5 text-sky-500" />
                    <span className="text-[11px] font-bold text-foreground">
                      Monitored Incidents: {stats.total} across Kwara
                    </span>
                  </div>

                  {/* Hotspots */}
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <div className="relative h-full w-full">
                      {/* Tanke */}
                      <div className="absolute left-[62%] top-[65%] flex flex-col items-center">
                        <span className="size-4 rounded-full bg-orange-500 ring-4 ring-orange-400/40 animate-pulse" />
                        <span className="mt-1 rounded bg-card/90 px-1.5 py-0.5 text-[10px] font-extrabold text-foreground shadow">
                          Tanke (🌊 Flood)
                        </span>
                      </div>

                      {/* Basin */}
                      <div className="absolute left-[38%] top-[42%] flex flex-col items-center">
                        <span className="size-4 rounded-full bg-red-500 ring-4 ring-red-400/40 animate-pulse" />
                        <span className="mt-1 rounded bg-card/90 px-1.5 py-0.5 text-[10px] font-extrabold text-foreground shadow">
                          Basin (🗑️ Drain Choke)
                        </span>
                      </div>

                      {/* GRA */}
                      <div className="absolute left-[52%] top-[20%] flex flex-col items-center">
                        <span className="size-3.5 rounded-full bg-amber-500 ring-4 ring-amber-400/40" />
                        <span className="mt-1 rounded bg-card/90 px-1.5 py-0.5 text-[10px] font-extrabold text-foreground shadow">
                          GRA (⚡ Wire Hazard)
                        </span>
                      </div>

                      {/* Adewole */}
                      <div className="absolute left-[20%] top-[55%] flex flex-col items-center">
                        <span className="size-3.5 rounded-full bg-purple-500 ring-4 ring-purple-400/40" />
                        <span className="mt-1 rounded bg-card/90 px-1.5 py-0.5 text-[10px] font-extrabold text-foreground shadow">
                          Adewole (🏗️ Culvert)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-3 right-3">
                    <Link
                      to="/map"
                      className="inline-flex items-center gap-1 rounded-xl bg-card/90 px-2.5 py-1 text-xs font-extrabold text-primary shadow-sm hover:bg-card"
                    >
                      Open Live Map <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-muted/60 p-3 text-xs font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="size-4 text-amber-500" />
                    Your Community Trust Score: <strong>{points} points</strong>
                  </span>
                  <Link to="/heroes" className="font-extrabold text-primary hover:underline">
                    View Badges &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Key Metrics Cards */}
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-3xl" aria-hidden>
                  📋
                </span>
                <DemoBadge />
              </div>
              <div className="mt-4 font-display text-4xl font-extrabold text-foreground">
                <CountUp to={stats.total} />
              </div>
              <p className="mt-1 text-sm font-bold text-muted-foreground">
                Total Incident Reports Recorded
              </p>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-3xl" aria-hidden>
                  🛡️
                </span>
                <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                  Trust Verified
                </span>
              </div>
              <div className="mt-4 font-display text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
                <CountUp to={stats.verified} />
              </div>
              <p className="mt-1 text-sm font-bold text-muted-foreground">
                Community Confirmed or Field Verified
              </p>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-3xl" aria-hidden>
                  ⚡
                </span>
                <span className="text-xs font-extrabold text-primary">5 Categories</span>
              </div>
              <div className="mt-4 font-display text-4xl font-extrabold text-foreground">
                <CountUp to={12} suffix=" Areas" />
              </div>
              <p className="mt-1 text-sm font-bold text-muted-foreground">
                Monitored Across Ilorin Metropole
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Community Incident Feed with Category Tabs */}
      <section className="mx-auto max-w-7xl px-4 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌍</span>
              <h2 className="font-display text-2xl font-extrabold text-foreground sm:text-3xl">
                Verified Incident Feed & Audit Trail
              </h2>
            </div>
            <p className="text-sm font-semibold text-muted-foreground">
              Explore recent reports submitted by citizens and verified by local community members.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-extrabold text-foreground hover:bg-muted"
            >
              Open Full Verification Ledger &rarr;
            </Link>
            <Link
              to="/report"
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-extrabold text-primary-foreground hover:bg-primary/90"
            >
              + Report Incident
            </Link>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategoryTab("all")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-extrabold transition-all ${
              selectedCategoryTab === "all"
                ? "bg-primary text-primary-foreground shadow"
                : "border border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            All Incidents ({reports.length})
          </button>
          {(Object.keys(CATEGORIES) as IncidentCategory[]).map((catKey) => {
            const cat = CATEGORIES[catKey];
            const count = reports.filter((r) => r.category === catKey).length;
            const isSelected = selectedCategoryTab === catKey;
            return (
              <button
                key={catKey}
                type="button"
                onClick={() => setSelectedCategoryTab(catKey)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-extrabold transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow"
                    : "border border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat.emoji} {cat.shortLabel} ({count})
              </button>
            );
          })}
        </div>

        {/* Feed Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredFeed.slice(0, 6).map((report) => {
            const hasPhoto = Boolean(report.photoUrl);

            return (
              <div
                key={report.id}
                onClick={() => setSelectedReportForDetail(report)}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card shadow-sm hover:shadow-md cursor-pointer transition-all"
              >
                <div>
                  {hasPhoto && (
                    <div className="relative aspect-video w-full overflow-hidden bg-muted">
                      <img
                        src={report.photoUrl}
                        alt={`Evidence photo at ${report.street}`}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (target.src.includes("/src/assets/")) {
                            target.src = target.src.replace("/src/assets/", "/assets/");
                          }
                        }}
                      />
                      <div className="absolute right-3 top-3 flex items-center gap-1.5">
                        <SeverityPill severity={report.severity} />
                      </div>
                      <div className="absolute left-3 top-3">
                        <CategoryPill category={report.category} />
                      </div>
                    </div>
                  )}

                  <div className="p-5 space-y-3">
                    {!hasPhoto && (
                      <div className="flex items-center justify-between">
                        <CategoryPill category={report.category} />
                        <SeverityPill severity={report.severity} />
                      </div>
                    )}

                    <div>
                      <h3 className="font-display text-lg font-extrabold text-foreground group-hover:text-primary transition-colors">
                        {report.title}
                      </h3>
                      <p className="flex items-center gap-1 text-xs font-bold text-muted-foreground mt-1">
                        <MapPin className="size-3.5 text-primary" /> {report.street},{" "}
                        {report.location}
                      </p>
                    </div>

                    {/* Verification and Status Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <VerificationBadge status={report.verificationStatus} />
                      <StatusBadge status={report.status} />
                    </div>

                    <p className="text-xs text-foreground/90 line-clamp-2 leading-relaxed">
                      {report.description}
                    </p>

                    {/* Relevant responder */}
                    <div className="rounded-xl bg-muted/50 p-2 text-[11px] font-semibold text-muted-foreground">
                      <strong>Civil Responder:</strong> {report.assignedResponder}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border bg-muted/20 px-5 py-3 text-xs font-bold">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmReport(report.id);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-foreground hover:bg-accent"
                  >
                    <ThumbsUp className="size-3.5 text-primary" />
                    Confirm ({report.confirmations})
                  </button>

                  <span className="text-[11px] text-muted-foreground font-semibold">
                    Trust: <strong className="text-foreground">{report.credibilityScore}%</strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Exploration Grid */}
      <section className="mx-auto max-w-7xl px-4">
        <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
              Discover TrustReport Modules
            </span>
            <h2 className="font-display text-3xl font-extrabold text-foreground">
              Tools for Community Resilience
            </h2>
          </div>
          <p className="max-w-md text-sm font-semibold text-muted-foreground">
            Tools designed to keep residents, emergency volunteers, and civil agencies coordinated.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: Map */}
          <Link
            to="/map"
            className="group relative flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <div>
              <div className="flex size-12 items-center justify-center rounded-2xl bg-sky-500/15 text-2xl">
                🗺️
              </div>
              <h3 className="mt-4 font-display text-xl font-extrabold text-foreground group-hover:text-primary">
                Incident Map & Safe Routes
              </h3>
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                See flood risks, road blocks, and hazard markers across 12 Ilorin areas with safer
                route advisory calculations.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-sm font-bold text-primary">
              Explore Incident Map{" "}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Card 2: Report */}
          <Link
            to="/report"
            className="group relative flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <div>
              <div className="flex size-12 items-center justify-center rounded-2xl bg-red-500/15 text-2xl">
                🚨
              </div>
              <h3 className="mt-4 font-display text-xl font-extrabold text-foreground group-hover:text-primary">
                Multi-Category Reporting
              </h3>
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                Submit observations with privacy protection, GPS locks, evidence photos, and instant
                AI credibility feedback.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-sm font-bold text-primary">
              Report Incident (+20 pts){" "}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Card 3: Dashboard */}
          <Link
            to="/dashboard"
            className="group relative flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <div>
              <div className="flex size-12 items-center justify-center rounded-2xl bg-purple-500/15 text-2xl">
                📊
              </div>
              <h3 className="mt-4 font-display text-xl font-extrabold text-foreground group-hover:text-primary">
                Verification Ledger & Audit Mode
              </h3>
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                Inspect audit logs, verify claims, export CSV datasets, and toggle Low-Bandwidth
                Mode for field usage.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-sm font-bold text-primary">
              Open Dashboard{" "}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Card 4: AI */}
          <Link
            to="/ai"
            className="group relative flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <div>
              <div className="flex size-12 items-center justify-center rounded-2xl bg-cyan-500/15 text-2xl">
                🤖
              </div>
              <h3 className="mt-4 font-display text-xl font-extrabold text-foreground group-hover:text-primary">
                TrustReport AI Assistant
              </h3>
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                AI advisor that evaluates incident descriptions, explains precautions, and helps
                structure high-credibility reports.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-sm font-bold text-primary">
              Consult AI Advisor{" "}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Card 5: Safety */}
          <Link
            to="/safety"
            className="group relative flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <div>
              <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-2xl">
                🛟
              </div>
              <h3 className="mt-4 font-display text-xl font-extrabold text-foreground group-hover:text-primary">
                Safety & Preparedness Center
              </h3>
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                Actionable guides on what to do during floods, electrical hazards, storm surges, and
                drainage maintenance.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-sm font-bold text-primary">
              View Safety Guides{" "}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Card 6: Heroes */}
          <Link
            to="/heroes"
            className="group relative flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <div>
              <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-500/15 text-2xl">
                🏆
              </div>
              <h3 className="mt-4 font-display text-xl font-extrabold text-foreground group-hover:text-primary">
                Community Heroes & Safety Quiz
              </h3>
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                Take the interactive safety quiz, earn points, climb the leaderboard, and unlock
                verified observer badges.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-sm font-bold text-primary">
              Play Safety Quiz{" "}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </section>

      {/* Community Clean & Dry Action Challenge */}
      <section className="mx-auto max-w-7xl px-4">
        <div className="overflow-hidden rounded-3xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-card to-cyan-500/10 p-6 lg:p-10 shadow-lg">
          <div className="grid items-center gap-8 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-extrabold text-emerald-700 dark:text-emerald-300">
                🌱 Community Action Campaign
              </span>
              <h2 className="font-display text-3xl font-extrabold text-foreground">
                Keep Ilorin Clean & Dry Campaign
              </h2>
              <p className="text-sm font-semibold text-muted-foreground">
                Blocked gutters and discarded plastics are the leading cause of urban runoff
                flooding. Check off civic actions you completed this week to earn points!
              </p>

              <div className="grid gap-2.5 pt-2 sm:grid-cols-2">
                {CHALLENGE_TASKS.map((task) => {
                  const done = hasAction(task.id);
                  return (
                    <button
                      key={task.id}
                      type="button"
                      onClick={() => handleChallengeTask(task.id)}
                      className={`flex items-center gap-3 rounded-2xl border p-3 text-left text-xs font-bold transition-all ${
                        done
                          ? "border-emerald-500 bg-emerald-500/15 text-emerald-800 dark:text-emerald-200"
                          : "border-border bg-card text-foreground hover:bg-accent"
                      }`}
                    >
                      <span className="text-xl" aria-hidden>
                        {task.emoji}
                      </span>
                      <span className="flex-1">{task.text}</span>
                      <span
                        className={`size-5 rounded-full flex items-center justify-center text-xs font-extrabold ${
                          done ? "bg-emerald-500 text-white" : "border border-border"
                        }`}
                      >
                        {done ? "✓" : "+5"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:col-span-5 text-center space-y-4">
              <div className="text-4xl">🏆</div>
              <h3 className="font-display text-xl font-extrabold">Your Community Trust Progress</h3>
              <div className="font-display text-4xl font-extrabold text-primary">{points} pts</div>
              <p className="text-xs font-bold text-muted-foreground">
                Complete civic tasks, pass the safety quiz, and verify local observations to level
                up your Trust Badges!
              </p>
              <Link
                to="/heroes"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground shadow"
              >
                Open Community Heroes & Quiz &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
