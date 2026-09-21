import React, { useState } from "react";
import { ShieldCheck, Lock, X, KeyRound, AlertCircle } from "lucide-react";
import { useReports } from "@/lib/reports-context";
import { toast } from "sonner";

export function ReviewerAuthModal() {
  const { isReviewerAuthOpen, setIsReviewerAuthOpen, authenticateReviewer } = useReports();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isReviewerAuthOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setError("Please enter the reviewer authorization passcode.");
      return;
    }

    const success = authenticateReviewer(passcode);
    if (success) {
      setError(null);
      setPasscode("");
      setIsReviewerAuthOpen(false);
      toast.success("Reviewer Audit Mode authorized! 🛡️");
    } else {
      setError("Invalid passcode. For demonstration testing, use: reviewer or trust2026");
    }
  };

  const handleUseDemo = (code: string) => {
    setPasscode(code);
    setError(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reviewer-auth-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-purple-500/10 p-5 text-purple-950 dark:text-purple-100">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-sm">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h2 id="reviewer-auth-title" className="font-display text-base font-extrabold">
                Reviewer Verification Gate
              </h2>
              <p className="text-[11px] font-semibold text-purple-800/80 dark:text-purple-300/80">
                Restricted Civic Observer & Auditor Interface
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsReviewerAuthOpen(false);
              setError(null);
              setPasscode("");
            }}
            className="flex size-8 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Close dialog"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs font-medium text-muted-foreground leading-relaxed">
            Reviewer Mode grants privileges to update incident verification statuses, add official
            audit log notes, and verify citizen evidence. Ordinary users cannot access this without
            credentials.
          </p>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-foreground">
              Reviewer Authorization PIN / Passcode
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <input
                type="password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Enter passcode (demo: reviewer)"
                className="w-full rounded-2xl border border-input bg-background pl-9 pr-3 py-2.5 text-xs font-bold text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-purple-500"
                autoFocus
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-destructive/15 p-3 text-xs font-bold text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Assist */}
          <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-3 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-[11px] text-purple-700 dark:text-purple-300 flex items-center gap-1">
                <Lock className="size-3" /> Demonstration Credential:
              </span>
              <button
                type="button"
                onClick={() => handleUseDemo("reviewer")}
                className="text-[11px] font-extrabold text-purple-600 dark:text-purple-400 underline hover:text-purple-700"
              >
                Autofill "reviewer"
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground leading-normal">
              Hackathon evaluators and peer testers may use{" "}
              <code className="font-mono bg-muted px-1 py-0.5 rounded">reviewer</code> or{" "}
              <code className="font-mono bg-muted px-1 py-0.5 rounded">trust2026</code>.
            </p>
          </div>

          {/* Limitation Disclosure */}
          <div className="text-[10px] text-muted-foreground leading-relaxed border-t border-border pt-3">
            <strong>Prototype Architecture Disclosure:</strong> This PIN gate models role-based
            separation for the hackathon demonstration. Production deployments enforce server-side
            authenticated RBAC and reviewer identity verification.
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsReviewerAuthOpen(false);
                setError(null);
                setPasscode("");
              }}
              className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-bold text-foreground hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-5 py-2 text-xs font-extrabold text-white shadow hover:bg-purple-700 active:scale-95"
            >
              <ShieldCheck className="size-4" /> Unlock Reviewer Mode
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
