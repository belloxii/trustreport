import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  MapPin,
  Clock,
  ThumbsUp,
  Users,
  AlertTriangle,
  FileCheck2,
  Lock,
  PhoneCall,
  History,
  CheckCircle2,
  ExternalLink,
  Share2,
  SlidersHorizontal,
} from "lucide-react";
import {
  IncidentReport,
  CATEGORIES,
  STATUS_CONFIG,
  VERIFICATION_CONFIG,
  ReportStatus,
  VerificationStatus,
} from "@/lib/floodguard-data";
import { SeverityPill } from "./SeverityPill";
import { CategoryPill } from "./CategoryPill";
import { StatusBadge } from "./StatusBadge";
import { VerificationBadge } from "./VerificationBadge";
import { useReports } from "@/lib/reports-context";
import { toast } from "sonner";

export function ReportDetailModal() {
  const {
    selectedReportForDetail,
    setSelectedReportForDetail,
    confirmReport,
    markUseful,
    updateReportStatus,
    isReviewerMode,
    setIsReviewerMode,
    hasUserConfirmed,
    isLowBandwidth,
  } = useReports();

  const report = selectedReportForDetail;

  const [reviewerStatus, setReviewerStatus] = useState<ReportStatus>(report?.status || "submitted");
  const [reviewerVerification, setReviewerVerification] = useState<VerificationStatus>(
    report?.verificationStatus || "unverified",
  );
  const [reviewerNote, setReviewerNote] = useState("");
  const [activeTab, setActiveTab] = useState<"details" | "audit" | "reviewer">("details");
  const [showPhotoInLowBandwidth, setShowPhotoInLowBandwidth] = useState(false);

  if (!report) return null;

  const category = CATEGORIES[report.category] || CATEGORIES.flooding;
  const isAlreadyConfirmed = hasUserConfirmed(report.id);

  const handleConfirm = () => {
    confirmReport(report.id);
  };

  const handleShare = () => {
    const text = `TrustReport ${report.id}: [${report.severity.toUpperCase()}] ${report.title} at ${report.location}, Ilorin.`;
    navigator.clipboard?.writeText(text);
    toast.success("Incident summary copied to clipboard!");
  };

  const handleSaveReviewerAction = (e: React.FormEvent) => {
    e.preventDefault();
    updateReportStatus(
      report.id,
      reviewerStatus,
      reviewerVerification,
      reviewerNote.trim() || undefined,
      "Civil Observer Lead",
    );
    setReviewerNote("");
    toast.success("Verification ledger updated successfully!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-border p-5 sm:p-6 bg-muted/20">
          <div className="space-y-1.5 pr-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-muted-foreground">{report.id}</span>
              <CategoryPill category={report.category} />
              <SeverityPill severity={report.severity} />
              <StatusBadge status={report.status} />
              {report.isSimulated && (
                <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-extrabold text-amber-700 dark:text-amber-300 border border-amber-500/20">
                  Demo Data
                </span>
              )}
            </div>
            <h2 className="font-display text-xl font-extrabold text-foreground sm:text-2xl leading-snug">
              {report.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-muted-foreground pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5 text-primary" /> {report.street}, {report.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" /> {report.timestamp}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSelectedReportForDetail(null)}
            className="rounded-2xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Close modal"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center border-b border-border bg-muted/30 px-6 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab("details")}
            className={`border-b-2 px-4 py-2.5 text-xs font-extrabold transition-colors ${
              activeTab === "details"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Incident Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("audit")}
            className={`border-b-2 px-4 py-2.5 text-xs font-extrabold transition-colors ${
              activeTab === "audit"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Audit Trail & History ({report.auditLog?.length || 0})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("reviewer")}
            className={`border-b-2 px-4 py-2.5 text-xs font-extrabold transition-colors flex items-center gap-1.5 ${
              activeTab === "reviewer"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShieldCheck className="size-3.5 text-purple-600 dark:text-purple-400" /> Reviewer Audit
            Panel
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {activeTab === "details" && (
            <>
              {/* Credibility & Trust Card */}
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary flex items-center gap-1.5">
                      <FileCheck2 className="size-3.5" /> Credibility Assessment
                    </span>
                    <div className="mt-1 flex items-center gap-2">
                      <VerificationBadge
                        status={report.verificationStatus}
                        confidenceScore={report.confidenceScore}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleConfirm}
                      disabled={isAlreadyConfirmed}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-extrabold shadow transition-all ${
                        isAlreadyConfirmed
                          ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 cursor-default"
                          : "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95"
                      }`}
                    >
                      {isAlreadyConfirmed ? (
                        <>
                          <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />{" "}
                          Corroborated ({report.confirmationsCount})
                        </>
                      ) : (
                        <>
                          <Users className="size-3.5" /> Corroborate / Confirm (
                          {report.confirmationsCount})
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => markUseful(report.id)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-extrabold text-foreground hover:bg-muted active:scale-95 transition-all"
                    >
                      <ThumbsUp className="size-3.5" /> Helpful ({report.usefulCount})
                    </button>
                    <button
                      type="button"
                      onClick={handleShare}
                      className="inline-flex items-center justify-center rounded-xl border border-border bg-card p-2 text-foreground hover:bg-muted"
                      title="Share report"
                    >
                      <Share2 className="size-3.5" />
                    </button>
                  </div>
                </div>

                {report.verificationNotes && (
                  <div className="rounded-xl bg-card border border-border p-3 text-xs font-semibold text-foreground/90 leading-relaxed">
                    <span className="font-extrabold text-primary block mb-0.5">
                      Reviewer Note ({report.reviewerBadge || "Community Reviewer"}):
                    </span>
                    {report.verificationNotes}
                  </div>
                )}
              </div>

              {/* Photo / Evidence if present */}
              {report.photoUrl && (
                <div className="overflow-hidden rounded-2xl border border-border bg-muted/20">
                  {isLowBandwidth && !showPhotoInLowBandwidth ? (
                    <div className="p-6 text-center space-y-3 bg-muted/30">
                      <div className="mx-auto flex size-10 items-center justify-center rounded-2xl bg-muted text-foreground">
                        📷
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">
                          Photo Evidence Available
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Low-Bandwidth Mode is active to preserve mobile cellular data.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPhotoInLowBandwidth(true)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-extrabold text-primary-foreground hover:bg-primary/90"
                      >
                        Load Image
                      </button>
                    </div>
                  ) : (
                    <div className="relative aspect-video max-h-72 w-full overflow-hidden bg-slate-900">
                      <img
                        src={report.photoUrl}
                        alt={report.title}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (target.src.includes("/src/assets/")) {
                            target.src = target.src.replace("/src/assets/", "/assets/");
                          }
                        }}
                      />
                      <span className="absolute bottom-2 left-2 rounded-lg bg-black/75 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                        📷 Attached Citizen Evidence
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Observation description */}
              <div className="space-y-2">
                <h3 className="font-display text-sm font-extrabold text-foreground">
                  Citizen Observation & Hazard Details
                </h3>
                <p className="rounded-2xl border border-border bg-muted/20 p-4 text-sm font-medium text-foreground leading-relaxed whitespace-pre-wrap">
                  {report.description}
                </p>
              </div>

              {/* Specific Attributes */}
              <div className="grid gap-3 sm:grid-cols-2">
                {report.waterLevel && (
                  <div className="rounded-2xl border border-border bg-card p-3.5">
                    <span className="text-[11px] font-bold text-muted-foreground block">
                      Water Level / Depth
                    </span>
                    <span className="font-display text-sm font-extrabold text-sky-600 dark:text-sky-400">
                      💧 {report.waterLevel}
                    </span>
                  </div>
                )}

                {report.hazardType && (
                  <div className="rounded-2xl border border-border bg-card p-3.5">
                    <span className="text-[11px] font-bold text-muted-foreground block">
                      Hazard Classification
                    </span>
                    <span className="font-display text-sm font-extrabold text-foreground">
                      ⚠️ {report.hazardType}
                    </span>
                  </div>
                )}

                <div className="rounded-2xl border border-border bg-card p-3.5">
                  <span className="text-[11px] font-bold text-muted-foreground block">
                    Reported By
                  </span>
                  <span className="font-display text-sm font-extrabold text-foreground">
                    {report.reporter.isAnonymous
                      ? "👤 Anonymous Resident"
                      : report.reporter.displayName}
                  </span>
                </div>

                <div className="rounded-2xl border border-border bg-card p-3.5">
                  <span className="text-[11px] font-bold text-muted-foreground block">
                    Recommended Civic Responder (Taxonomy Mapping)
                  </span>
                  <span className="font-display text-sm font-extrabold text-foreground">
                    🏢 {report.escalatedTo || category.defaultResponder}
                  </span>
                </div>

                {report.isCoordinatesFuzzed && (
                  <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-3.5 sm:col-span-2">
                    <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300 block">
                      📍 Location Privacy Applied (PR-02)
                    </span>
                    <span className="text-xs font-semibold text-foreground">
                      Coordinates coarsened within ±{report.fuzzedRadiusMeters || 300}m to protect
                      resident household privacy.
                    </span>
                  </div>
                )}
              </div>

              {/* Safety Action & Emergency Box */}
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-extrabold text-amber-900 dark:text-amber-200">
                  <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
                  Recommended Public Safety Action
                </div>
                <p className="text-xs font-medium text-amber-950 dark:text-amber-100 leading-relaxed">
                  {report.safetyAdvice}
                </p>
                {category.responderPhone && (
                  <div className="mt-2 flex items-center gap-2 pt-2 border-t border-amber-500/20 text-xs font-bold text-amber-950 dark:text-amber-100">
                    <PhoneCall className="size-3.5" /> Emergency Contact Hotline:{" "}
                    <span className="font-mono underline">{category.responderPhone}</span>
                  </div>
                )}
              </div>

              {/* Privacy Notice */}
              <div className="flex items-center gap-2 text-[11px] font-semibold text-muted-foreground rounded-xl bg-muted/40 p-3">
                <Lock className="size-3.5 text-primary shrink-0" />
                <span>
                  <strong>Privacy Protected:</strong> Reporter phone numbers and precise personal
                  identifiers are kept strictly confidential and never displayed on public feeds.
                </span>
              </div>
            </>
          )}

          {activeTab === "audit" && (
            <div className="space-y-4">
              <div>
                <h3 className="font-display text-base font-extrabold text-foreground flex items-center gap-2">
                  <History className="size-4 text-primary" /> Transparent Verification Ledger
                </h3>
                <p className="text-xs font-medium text-muted-foreground mt-0.5">
                  Every status change, reviewer inspection, and community confirmation is
                  chronologically recorded in this append-only audit trail.
                </p>
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:bottom-0 before:left-2.5 before:top-2 before:w-0.5 before:bg-border">
                {report.auditLog?.map((log, index) => (
                  <div key={log.id || index} className="relative space-y-1">
                    <div className="absolute -left-6 top-1 flex size-4 items-center justify-center rounded-full bg-primary ring-4 ring-card">
                      <div className="size-1.5 rounded-full bg-white" />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-foreground">{log.action}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {log.timestamp}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-primary">{log.actor}</div>
                    {log.note && (
                      <p className="rounded-xl bg-muted/40 p-2.5 text-xs font-medium text-muted-foreground">
                        {log.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "reviewer" && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-purple-500/30 bg-purple-500/10 p-4">
                <div className="flex items-center gap-2 text-sm font-extrabold text-purple-900 dark:text-purple-200">
                  <ShieldCheck className="size-5 text-purple-600 dark:text-purple-400" />
                  Community Verification & Civil Observer Mode
                </div>
                <p className="text-xs font-medium text-purple-950 dark:text-purple-100 mt-1 leading-relaxed">
                  As an authorized community reviewer or hackathon evaluator, you can audit the
                  authenticity of this incident, modify lifecycle status, and publish public review
                  notes.
                </p>
              </div>

              <form onSubmit={handleSaveReviewerAction} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1.5">
                      Update Report Status
                    </label>
                    <select
                      value={reviewerStatus}
                      onChange={(e) => setReviewerStatus(e.target.value as ReportStatus)}
                      className="w-full rounded-xl border border-input bg-background p-2.5 text-xs font-bold text-foreground focus:ring-2 focus:ring-primary"
                    >
                      <option value="submitted">Submitted (In Queue)</option>
                      <option value="under_review">Under Review</option>
                      <option value="verified">Verified (Active Warning)</option>
                      <option value="in_progress">In Progress (Dispatching)</option>
                      <option value="resolved">Resolved (Safe / Cleared)</option>
                      <option value="rejected">Unverified / Closed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1.5">
                      Verification Credibility Level
                    </label>
                    <select
                      value={reviewerVerification}
                      onChange={(e) =>
                        setReviewerVerification(e.target.value as VerificationStatus)
                      }
                      className="w-full rounded-xl border border-input bg-background p-2.5 text-xs font-bold text-foreground focus:ring-2 focus:ring-primary"
                    >
                      <option value="unverified">⏳ Pending Verification</option>
                      <option value="community_confirmed">
                        👥 Community Confirmed (3+ Witnesses)
                      </option>
                      <option value="field_verified">✅ Field Verified (On-Site Audit)</option>
                      <option value="official_escalated">
                        🚨 Official Escalated (Emergency Desk)
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">
                    Reviewer Verification Notes
                  </label>
                  <textarea
                    rows={3}
                    value={reviewerNote}
                    onChange={(e) => setReviewerNote(e.target.value)}
                    placeholder="Enter audit observations, photo validation details, or dispatch confirmation notes..."
                    className="w-full rounded-xl border border-input bg-background p-3 text-xs font-medium text-foreground focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-extrabold text-white shadow hover:bg-purple-700 active:scale-95 transition-all"
                  >
                    <CheckCircle2 className="size-4" /> Save Verification Audit
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-border bg-muted/20 p-4 px-6">
          <span className="text-[11px] font-semibold text-muted-foreground">
            TrustReport Ilorin · Information You Can Trust
          </span>
          <button
            type="button"
            onClick={() => setSelectedReportForDetail(null)}
            className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-bold text-foreground hover:bg-muted transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
