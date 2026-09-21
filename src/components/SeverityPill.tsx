import { SEVERITY, type Severity } from "@/lib/floodguard-data";

export function SeverityPill({
  severity,
  className = "",
}: {
  severity: Severity;
  className?: string;
}) {
  const s = SEVERITY[severity];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold text-foreground ring-2 ${s.ring} bg-card ${className}`}
    >
      <span className={`size-2.5 rounded-full ${s.color}`} aria-hidden />
      {s.label}
    </span>
  );
}
