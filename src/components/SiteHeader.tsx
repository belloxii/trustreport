import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Sparkles, ShieldCheck } from "lucide-react";
import { FloodGuardLogo } from "./FloodGuardLogo";
import { useProgress } from "@/lib/progress";
import { useReports } from "@/lib/reports-context";

const NAV = [
  { to: "/", label: "Home", emoji: "🏠" },
  { to: "/report", label: "Report Incident", emoji: "🚨" },
  { to: "/map", label: "Incident Map", emoji: "🗺️" },
  { to: "/dashboard", label: "Dashboard & Verification", emoji: "📊" },
  { to: "/ai", label: "Trust AI", emoji: "🤖" },
  { to: "/safety", label: "Safety Center", emoji: "🛟" },
  { to: "/heroes", label: "Community Heroes", emoji: "🏆" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { points } = useProgress();
  const { isReviewerMode, toggleReviewerMode, isLowBandwidth, setIsLowBandwidth } = useReports();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5">
        <Link to="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setOpen(false)}>
          <FloodGuardLogo size={38} />
          <span className="leading-tight">
            <span className="flex items-center gap-1.5 font-display text-lg font-extrabold text-gradient">
              TrustReport{" "}
              <span className="text-[10px] rounded-md bg-primary/15 px-1.5 py-0.5 text-primary">
                Ilorin
              </span>
            </span>
            <span className="block text-[11px] font-bold text-muted-foreground">
              Information You Can Trust
            </span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-0.5 lg:flex" aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="rounded-full px-3 py-1.5 text-xs font-bold text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              activeProps={{ className: "bg-primary/12 !text-primary shadow-sm" }}
            >
              <span aria-hidden className="mr-1">
                {item.emoji}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          {/* Low Bandwidth Mode toggle */}
          <button
            type="button"
            onClick={() => setIsLowBandwidth(!isLowBandwidth)}
            title="Toggle Low Bandwidth Mode"
            className={`hidden sm:inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold transition-all ${
              isLowBandwidth
                ? "border-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-300"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>📶</span>
            <span>{isLowBandwidth ? "Low Data: ON" : "Low Data"}</span>
          </button>

          {/* Reviewer Mode toggle button */}
          <button
            type="button"
            onClick={toggleReviewerMode}
            title="Toggle Reviewer Audit Mode"
            className={`hidden sm:inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-extrabold transition-all ${
              isReviewerMode
                ? "border-purple-500 bg-purple-500/15 text-purple-700 dark:text-purple-300 shadow-sm"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShieldCheck className="size-3.5 text-purple-600 dark:text-purple-400" />
            <span className="hidden md:inline">Reviewer Mode:</span>
            <span>{isReviewerMode ? "ON" : "OFF"}</span>
          </button>

          {/* Points pill */}
          <span className="hidden items-center gap-1 rounded-full gradient-sunny px-3 py-1 text-xs font-extrabold text-[var(--sun-foreground)] sm:inline-flex shadow-sm">
            <Sparkles className="size-3.5" aria-hidden /> {points} pts
          </span>

          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-2xl border border-border bg-card text-foreground lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="border-t border-border bg-card px-4 py-3 lg:hidden space-y-3"
          aria-label="Mobile"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 px-2 pt-1">
            <button
              type="button"
              onClick={() => {
                toggleReviewerMode();
                setOpen(false);
              }}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-extrabold ${
                isReviewerMode
                  ? "border-purple-500 bg-purple-500/15 text-purple-700 dark:text-purple-300"
                  : "border-border bg-background text-muted-foreground"
              }`}
            >
              <ShieldCheck className="size-4" /> Reviewer Mode: {isReviewerMode ? "ACTIVE" : "OFF"}
            </button>
            <button
              type="button"
              onClick={() => setIsLowBandwidth(!isLowBandwidth)}
              className={`flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-bold ${
                isLowBandwidth
                  ? "border-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-300"
                  : "border-border bg-background text-muted-foreground"
              }`}
            >
              <span>📶</span> Low Data: {isLowBandwidth ? "ON" : "OFF"}
            </button>
            <span className="text-xs font-extrabold text-amber-600">⭐ {points} points</span>
          </div>

          <ul className="grid gap-1">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.to === "/" }}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-accent"
                  activeProps={{ className: "bg-primary/12 !text-primary" }}
                >
                  <span aria-hidden className="text-lg">
                    {item.emoji}
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
