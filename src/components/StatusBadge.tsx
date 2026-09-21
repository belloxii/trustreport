import { ReportStatus, STATUS_CONFIG } from "@/lib/floodguard-data";

export function StatusBadge({
  status,
  className = "",
}: {
  status: ReportStatus;
  className?: string;
}) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.submitted;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-extrabold ${cfg.badgeBg} ${className}`}
    >
      <span className="size-1.5 rounded-full bg-current opacity-80" />
      <span>{cfg.label}</span>
    </span>
  );
}
