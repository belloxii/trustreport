import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  IncidentReport,
  INITIAL_REPORTS,
  IncidentCategory,
  Severity,
  ReportStatus,
  VerificationStatus,
  CATEGORIES,
} from "./floodguard-data";
import { toast } from "sonner";
import { useProgress } from "./progress";
import { ReviewerAuthModal } from "@/components/ReviewerAuthModal";

interface NewReportInput {
  title: string;
  category: IncidentCategory;
  severity: Severity;
  location: string;
  street: string;
  description: string;
  waterLevel?: string;
  hazardType?: string;
  photoUrl?: string;
  isAnonymous: boolean;
  reporterName?: string;
  contactPhonePrivate?: string;
  coordinates?: { lat: number; lng: number; x?: number; y?: number };
  isCoordinatesFuzzed?: boolean;
  fuzzedRadiusMeters?: number;
}

export interface ReportStats {
  total: number;
  verified: number;
  critical: number;
  inProgress: number;
  resolved: number;
}

interface ReportsContextType {
  reports: IncidentReport[];
  stats: ReportStats;
  isLowBandwidth: boolean;
  setIsLowBandwidth: (enabled: boolean) => void;
  isReviewerMode: boolean;
  setIsReviewerMode: (enabled: boolean) => void;
  toggleReviewerMode: () => void;
  isReviewerAuthOpen: boolean;
  setIsReviewerAuthOpen: (open: boolean) => void;
  authenticateReviewer: (passcode: string) => boolean;
  hasUserConfirmed: (id: string) => boolean;
  selectedReportForDetail: IncidentReport | null;
  setSelectedReportForDetail: (report: IncidentReport | null) => void;
  addReport: (input: NewReportInput) => IncidentReport;
  confirmReport: (id: string) => void;
  markUseful: (id: string) => void;
  updateReportStatus: (
    id: string,
    newStatus: ReportStatus,
    newVerificationStatus: VerificationStatus,
    reviewerNote?: string,
    reviewerName?: string,
  ) => void;
  resetToDefaultReports: () => void;
  resetToDefaults: () => void;
}

const STORAGE_KEY = "trustreport_reports_v2";
const USER_CONFIRMED_KEY = "trustreport_user_confirmations_v1";
const REVIEWER_SESSION_KEY = "trustreport_reviewer_session";

function normalizePhotoUrl(url?: string, category?: string): string | undefined {
  if (url && typeof url === "string" && url.trim().length > 0) {
    if (url.startsWith("/src/assets/")) {
      return url.replace("/src/assets/", "/assets/");
    }
    return url;
  }
  // Ensure every report has photo evidence matching its category
  if (category === "flooding") return "/assets/report-street.jpg";
  if (category === "infrastructure") return "/assets/report-road-sinkhole.jpg";
  if (category === "sanitation") return "/assets/report-drainage.jpg";
  if (category === "utility") return "/assets/report-utility-wire.jpg";
  if (category === "safety") return "/assets/report-open-drain.jpg";
  return "/assets/report-street.jpg";
}

function normalizeReport(r: IncidentReport): IncidentReport {
  const dateIso = r.reportedAt || r.createdAt || new Date().toISOString();
  return {
    ...r,
    createdAt: dateIso,
    reportedAt: dateIso,
    photoUrl: normalizePhotoUrl(r.photoUrl, r.category),
    isCoordinatesFuzzed: Boolean(r.isCoordinatesFuzzed),
    fuzzedRadiusMeters: r.fuzzedRadiusMeters || 300,
    confirmations: r.confirmationsCount ?? r.confirmations ?? 0,
    confirmationsCount: r.confirmationsCount ?? r.confirmations ?? 0,
    credibilityScore: r.confidenceScore ?? r.credibilityScore ?? 50,
    confidenceScore: r.confidenceScore ?? r.credibilityScore ?? 50,
    assignedResponder: r.escalatedTo ?? r.assignedResponder ?? "Kwara Response Dispatch",
    escalatedTo: r.escalatedTo ?? r.assignedResponder ?? "Kwara Response Dispatch",
  };
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export function ReportsProvider({ children }: { children: React.ReactNode }) {
  const { addPoints } = useProgress();
  const [reports, setReports] = useState<IncidentReport[]>(() => {
    if (typeof window === "undefined") return INITIAL_REPORTS.map(normalizeReport);
    try {
      const savedV2 = localStorage.getItem(STORAGE_KEY);
      if (savedV2) {
        const parsed = JSON.parse(savedV2);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(normalizeReport);
        }
      }
      // Migrate from v1 if present, ensuring new seed reports are included
      const savedV1 = localStorage.getItem("trustreport_reports_v1");
      if (savedV1) {
        const parsedV1 = JSON.parse(savedV1);
        if (Array.isArray(parsedV1)) {
          const userSubmitted = parsedV1.filter(
            (p: IncidentReport) => !INITIAL_REPORTS.some((init) => init.id === p.id),
          );
          const combined = [...INITIAL_REPORTS, ...userSubmitted].map(normalizeReport);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(combined));
          return combined;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_REPORTS.map(normalizeReport);
  });

  const [selectedReportForDetail, setSelectedReportForDetail] = useState<IncidentReport | null>(
    null,
  );
  const [isReviewerMode, setIsReviewerMode] = useState(false);
  const [isReviewerAuthOpen, setIsReviewerAuthOpen] = useState(false);
  const [isLowBandwidth, setIsLowBandwidth] = useState(false);

  // Track verified/confirmed reports by this user/device to prevent duplicates
  const [userConfirmedIds, setUserConfirmedIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(USER_CONFIRMED_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const hasUserConfirmed = (id: string) => userConfirmedIds.includes(id);

  const toggleReviewerMode = () => {
    if (isReviewerMode) {
      setIsReviewerMode(false);
      toast.info("Reviewer Audit Mode deactivated.");
      return;
    }

    // Check if session has already been authorized
    if (typeof window !== "undefined") {
      const isAuth = sessionStorage.getItem(REVIEWER_SESSION_KEY) === "true";
      if (isAuth) {
        setIsReviewerMode(true);
        toast.success("Reviewer Audit Mode active (Authorized Session) 🛡️");
        return;
      }
    }

    // Prompt for reviewer credentials
    setIsReviewerAuthOpen(true);
  };

  const authenticateReviewer = (passcode: string): boolean => {
    const clean = passcode.trim().toLowerCase();
    if (clean === "reviewer" || clean === "trust2026") {
      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem(REVIEWER_SESSION_KEY, "true");
        } catch {
          // ignore
        }
      }
      setIsReviewerMode(true);
      return true;
    }
    return false;
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    } catch {
      // ignore
    }
  }, [reports]);

  // Derived Summary Statistics
  const stats: ReportStats = useMemo(() => {
    const total = reports.length;
    const verified = reports.filter(
      (r) =>
        r.verificationStatus === "community_confirmed" ||
        r.verificationStatus === "field_verified" ||
        r.verificationStatus === "official_escalated" ||
        r.status === "verified",
    ).length;
    const critical = reports.filter(
      (r) => r.severity === "critical" || r.severity === "high",
    ).length;
    const inProgress = reports.filter((r) => r.status === "in_progress").length;
    const resolved = reports.filter((r) => r.status === "resolved").length;

    return { total, verified, critical, inProgress, resolved };
  }, [reports]);

  const addReport = (input: NewReportInput): IncidentReport => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const id = `TR-ILR-${randomNum}`;
    const categoryConfig = CATEGORIES[input.category] || CATEGORIES.flooding;

    // Estimate coordinates based on neighborhood if none provided
    const defaultCoords: Record<string, { lat: number; lng: number; x: number; y: number }> = {
      Tanke: { lat: 8.482, lng: 4.595, x: 62, y: 65 },
      GRA: { lat: 8.485, lng: 4.551, x: 52, y: 20 },
      Fate: { lat: 8.489, lng: 4.572, x: 60, y: 35 },
      Adewole: { lat: 8.47, lng: 4.52, x: 20, y: 55 },
      Sango: { lat: 8.52, lng: 4.568, x: 75, y: 22 },
      "Oke-Odo": { lat: 8.468, lng: 4.605, x: 80, y: 75 },
      Basin: { lat: 8.498, lng: 4.58, x: 38, y: 42 },
      Taiwo: { lat: 8.475, lng: 4.542, x: 32, y: 68 },
      Maraba: { lat: 8.5, lng: 4.555, x: 45, y: 58 },
      Challenge: { lat: 8.48, lng: 4.538, x: 48, y: 72 },
      Kulende: { lat: 8.528, lng: 4.575, x: 82, y: 30 },
      Pakata: { lat: 8.495, lng: 4.51, x: 15, y: 35 },
    };

    let coords = input.coordinates ||
      defaultCoords[input.location] || {
        lat: 8.485,
        lng: 4.55,
        x: 50,
        y: 50,
      };

    if (input.isCoordinatesFuzzed) {
      // Jitter slightly for home privacy (~200m - 350m)
      coords = {
        ...coords,
        lat: Number((coords.lat + (Math.random() - 0.5) * 0.004).toFixed(4)),
        lng: Number((coords.lng + (Math.random() - 0.5) * 0.004).toFixed(4)),
      };
    }

    const newReport: IncidentReport = normalizeReport({
      id,
      title:
        input.title.trim() || `${categoryConfig.shortLabel} incident reported in ${input.location}`,
      category: input.category,
      severity: input.severity,
      location: input.location,
      street: input.street.trim() || "Unspecified street",
      coordinates: coords,
      isCoordinatesFuzzed: Boolean(input.isCoordinatesFuzzed),
      fuzzedRadiusMeters: input.fuzzedRadiusMeters || (input.isCoordinatesFuzzed ? 300 : undefined),
      description: input.description.trim(),
      waterLevel: input.waterLevel,
      hazardType: input.hazardType || categoryConfig.shortLabel,
      timestamp: "Just now",
      reportedAt: new Date().toISOString(),
      photoUrl: input.photoUrl,
      status: "submitted",
      verificationStatus: "unverified",
      confidenceScore: 50,
      credibilityScore: 50,
      confirmationsCount: 1,
      confirmations: 1,
      usefulCount: 1,
      isSimulated: false, // Live user report!
      reporter: {
        isAnonymous: input.isAnonymous,
        displayName: input.isAnonymous
          ? "Community Resident (Anonymous)"
          : input.reporterName?.trim() || "Community Resident",
        contactPhonePrivate: input.contactPhonePrivate?.trim() || undefined,
        badge: "Citizen Reporter",
      },
      safetyAdvice: `Exercise caution in ${input.location}. For severe emergencies, contact ${categoryConfig.defaultResponder}.`,
      escalatedTo: categoryConfig.defaultResponder,
      assignedResponder: categoryConfig.defaultResponder,
      auditLog: [
        {
          id: `log-${Date.now()}`,
          timestamp: "Just now",
          action: "Report Submitted",
          actor: input.isAnonymous
            ? "Citizen (Anonymous)"
            : input.reporterName?.trim() || "Citizen",
          note: "Incident logged to community verification ledger with pending status.",
        },
      ],
    });

    setReports((prev) => [newReport, ...prev]);
    addPoints(20, `report-${id}`);
    toast.success(`🎉 Report ${id} submitted! +20 Community Points`);
    return newReport;
  };

  const confirmReport = (id: string) => {
    if (userConfirmedIds.includes(id)) {
      toast.info("You have already confirmed/corroborated this incident report.");
      return;
    }

    // Persist confirmation locally
    const updatedConfirmed = [...userConfirmedIds, id];
    setUserConfirmedIds(updatedConfirmed);
    try {
      localStorage.setItem(USER_CONFIRMED_KEY, JSON.stringify(updatedConfirmed));
    } catch {
      // ignore
    }

    setReports((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const currentCount = r.confirmationsCount ?? r.confirmations ?? 0;
        const newCount = currentCount + 1;
        let newVerStatus = r.verificationStatus;
        const currentScore = r.confidenceScore ?? r.credibilityScore ?? 50;
        const newScore = Math.min(99, currentScore + 6);
        let newStatus = r.status;

        if (newCount >= 3 && r.verificationStatus === "unverified") {
          newVerStatus = "community_confirmed";
          if (r.status === "submitted") newStatus = "verified";
        }

        const newLog = [
          ...r.auditLog,
          {
            id: `log-${Date.now()}`,
            timestamp: "Just now",
            action: "Community Neighbor Confirmation",
            actor: "Community Member",
            note: `Corroborated by local resident (+1). Total confirmations: ${newCount}.`,
          },
        ];

        return normalizeReport({
          ...r,
          confirmationsCount: newCount,
          confirmations: newCount,
          verificationStatus: newVerStatus,
          confidenceScore: newScore,
          credibilityScore: newScore,
          status: newStatus,
          auditLog: newLog,
        });
      }),
    );
    addPoints(15, `confirm-${id}-${Date.now()}`);
    toast.success("Thank you! You corroborated this report (+15 points) 🌟");
  };

  const markUseful = (id: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, usefulCount: (r.usefulCount || 0) + 1 } : r)),
    );
    toast.success("Feedback recorded!");
  };

  const updateReportStatus = (
    id: string,
    newStatus: ReportStatus,
    newVerificationStatus: VerificationStatus,
    reviewerNote?: string,
    reviewerName: string = "Community Reviewer",
  ) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;

        let confidence = r.confidenceScore ?? r.credibilityScore ?? 50;
        if (newVerificationStatus === "field_verified") confidence = 96;
        if (newVerificationStatus === "official_escalated") confidence = 98;
        if (newStatus === "rejected") confidence = 20;

        const auditEntry = {
          id: `log-${Date.now()}`,
          timestamp: "Just now",
          action: `Status updated to ${newStatus.toUpperCase()} (${newVerificationStatus})`,
          actor: reviewerName,
          note: reviewerNote || "Reviewer evaluated incident evidence and confirmed status.",
        };

        return normalizeReport({
          ...r,
          status: newStatus,
          verificationStatus: newVerificationStatus,
          verificationNotes: reviewerNote || r.verificationNotes,
          confidenceScore: confidence,
          credibilityScore: confidence,
          reviewerBadge: "Verified Community Observer",
          auditLog: [...r.auditLog, auditEntry],
        });
      }),
    );
    toast.success(`Report status updated to ${newStatus}`);
  };

  const resetToDefaultReports = () => {
    const normalized = INITIAL_REPORTS.map(normalizeReport);
    setReports(normalized);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("trustreport_reports_v1");
    localStorage.removeItem(USER_CONFIRMED_KEY);
    setUserConfirmedIds([]);
    toast.info("Reset to default demonstration reports.");
  };

  return (
    <ReportsContext.Provider
      value={{
        reports,
        stats,
        isLowBandwidth,
        setIsLowBandwidth,
        isReviewerMode,
        setIsReviewerMode,
        toggleReviewerMode,
        isReviewerAuthOpen,
        setIsReviewerAuthOpen,
        authenticateReviewer,
        hasUserConfirmed,
        selectedReportForDetail,
        setSelectedReportForDetail,
        addReport,
        confirmReport,
        markUseful,
        updateReportStatus,
        resetToDefaultReports,
        resetToDefaults: resetToDefaultReports,
      }}
    >
      {children}
      <ReviewerAuthModal />
    </ReportsContext.Provider>
  );
}

export function useReports() {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error("useReports must be used within a ReportsProvider");
  }
  return context;
}
