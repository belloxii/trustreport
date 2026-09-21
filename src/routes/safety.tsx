import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Droplets,
  Zap,
  Trash2,
  Compass,
} from "lucide-react";
import { DemoBadge } from "@/components/DemoBadge";
import { SAFETY_SECTIONS, FLOOD_CAUSES, CHALLENGE_TASKS } from "@/lib/floodguard-data";
import { useProgress } from "@/lib/progress";
import { toast } from "sonner";

export const Route = createFileRoute("/safety")({
  component: SafetyPage,
});

function SafetyPage() {
  const { points, addPoints, hasAction } = useProgress();
  const [expandedCause, setExpandedCause] = useState<string | null>(FLOOD_CAUSES[0].title);

  const handleChallengeTask = (taskId: string) => {
    if (hasAction(taskId)) return;
    addPoints(5, taskId);
    toast.success("Action logged! +5 Flood Hero points 🌟");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-10">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🛟</span>
          <h1 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
            Flood Safety Center
          </h1>
          <DemoBadge />
        </div>
        <p className="mt-2 text-sm font-semibold text-muted-foreground max-w-2xl">
          Simple, life-saving rules for students, families, and schools in Ilorin. Learn how to
          prepare, respond, and protect your home during the rainy season.
        </p>
      </div>

      {/* 3 Core Timeline Cards: Before, During, After */}
      <div className="grid gap-6 md:grid-cols-3">
        {SAFETY_SECTIONS.map((section) => (
          <div
            key={section.phase}
            className="flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div>
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/15 text-2xl">
                {section.emoji}
              </div>
              <h2 className="mt-4 font-display text-xl font-extrabold text-foreground">
                {section.phase} a Flood
              </h2>
              <p className="mt-1 text-xs font-bold text-primary">{section.tagline}</p>

              <ul className="mt-4 space-y-3">
                {section.tips.map((tip, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs font-medium text-foreground/90"
                  >
                    <CheckCircle2 className="size-4 shrink-0 text-primary mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 rounded-2xl bg-muted/40 p-3 text-[11px] font-bold text-muted-foreground text-center">
              Safety rule:{" "}
              {section.phase === "During" ? "Turn around, don't drown!" : "Always stay alert"}
            </div>
          </div>
        ))}
      </div>

      {/* Emergency Grab Bag Checklist Callout */}
      <div className="rounded-3xl border-2 border-primary/20 bg-gradient-to-r from-primary/10 via-card to-card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
              🎒 Family Preparedness
            </span>
            <h2 className="font-display text-2xl font-extrabold text-foreground mt-1">
              What Goes in Your Emergency Grab-and-Go Bag?
            </h2>
            <p className="mt-1 text-xs font-semibold text-muted-foreground max-w-xl">
              Keep a water-resistant backpack packed and ready by your front door during months of
              heavy rains in Kwara State:
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-primary/20 px-4 py-2 text-xs font-extrabold text-primary">
            <Sparkles className="size-4" /> Ready in 5 Minutes
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Torch & Radio", desc: "Battery flashlight & extra batteries", icon: "🔦" },
            {
              title: "Clean Water",
              desc: "At least 2 bottles of sealed drinking water",
              icon: "💧",
            },
            {
              title: "Sealed Papers",
              desc: "Birth certificates & school IDs in ziploc bags",
              icon: "📄",
            },
            {
              title: "First Aid Kit",
              desc: "Bandages, antiseptic, and essential meds",
              icon: "🩹",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-border bg-card p-4 shadow-sm"
            >
              <span className="text-2xl" aria-hidden>
                {item.icon}
              </span>
              <h3 className="mt-2 font-display text-sm font-extrabold text-foreground">
                {item.title}
              </h3>
              <p className="mt-1 text-xs font-medium text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Keep Ilorin Clean & Dry Interactive Challenge */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-extrabold text-foreground flex items-center gap-2">
              <span>🌱</span> Keep Ilorin Clean & Dry Challenge
            </h2>
            <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-extrabold text-emerald-700 dark:text-emerald-300">
              Score: {points} pts
            </span>
          </div>
          <p className="mt-1 text-xs font-semibold text-muted-foreground">
            Check off actions you or your family took this week. Every completed task awards +5
            Flood Hero points!
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {CHALLENGE_TASKS.map((task) => {
            const isDone = hasAction(task.id);
            return (
              <button
                key={task.id}
                type="button"
                onClick={() => handleChallengeTask(task.id)}
                className={`flex items-center gap-3.5 rounded-2xl border p-4 text-left transition-all ${
                  isDone
                    ? "border-emerald-500 bg-emerald-500/15 text-emerald-900 dark:text-emerald-100 shadow-sm"
                    : "border-border bg-background text-foreground hover:bg-muted/40"
                }`}
              >
                <span className="text-2xl" aria-hidden>
                  {task.emoji}
                </span>
                <span className="flex-1 text-xs font-bold">{task.text}</span>
                <span
                  className={`size-6 rounded-full flex items-center justify-center text-xs font-extrabold ${
                    isDone ? "bg-emerald-500 text-white" : "border-2 border-border"
                  }`}
                >
                  {isDone ? "✓" : "+5"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Why Flooding Happens in Ilorin (Educational Accordion) */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
            💡 Educational Insight
          </span>
          <h2 className="font-display text-2xl font-extrabold text-foreground mt-1">
            Why Does Flooding Happen in Ilorin?
          </h2>
          <p className="mt-1 text-xs font-semibold text-muted-foreground">
            Understanding the science and human factors behind floods helps us build smarter
            drainage and protect our communities.
          </p>
        </div>

        <div className="grid gap-3">
          {FLOOD_CAUSES.map((cause) => {
            const isOpen = expandedCause === cause.title;
            return (
              <div
                key={cause.title}
                className="overflow-hidden rounded-2xl border border-border bg-background transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setExpandedCause(isOpen ? null : cause.title)}
                  className="flex w-full items-center justify-between p-4 text-left font-display text-sm font-extrabold text-foreground hover:bg-muted/30"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xl" aria-hidden>
                      {cause.emoji}
                    </span>
                    <span>{cause.title}</span>
                  </span>
                  {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                </button>

                {isOpen && (
                  <div className="border-t border-border/60 bg-muted/20 px-5 py-4 text-xs font-medium text-muted-foreground leading-relaxed">
                    {cause.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
