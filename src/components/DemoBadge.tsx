import { Info } from "lucide-react";

export function DemoBadge({ label = "Demo Data" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--sun)]/35 px-2.5 py-1 text-xs font-bold text-[var(--sun-foreground)] ring-1 ring-[var(--sun)]/60">
      ⚠️ {label}
    </span>
  );
}

export function DemoNotice({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-[var(--sun)]/60 bg-[var(--sun)]/20 p-4 text-sm font-semibold text-[var(--sun-foreground)]">
      <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
      <p>{children}</p>
    </div>
  );
}
