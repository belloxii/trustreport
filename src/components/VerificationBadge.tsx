import { VerificationStatus, VERIFICATION_CONFIG } from "@/lib/floodguard-data";

export function VerificationBadge({
  status,
  confidenceScore,
  className = "",
  showDetails = false,
}: {
  status: VerificationStatus;
  confidenceScore?: number;
  className?: string;
  showDetails?: boolean;
}) {
  const cfg = VERIFICATION_CONFIG[status] || VERIFICATION_CONFIG.unverified;

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <span
        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-extrabold ${cfg.badgeBg}`}
      >
        <span aria-hidden>{cfg.emoji}</span>
        <span>{cfg.label}</span>
        {confidenceScore !== undefined && (
          <span className="ml-1 opacity-80 font-mono text-[10px]">{confidenceScore}%</span>
        )}
      </span>

      {showDetails && (
        <span className="text-[11px] font-medium text-muted-foreground">{cfg.description}</span>
      )}
    </div>
  );
}
