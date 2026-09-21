import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  AlertTriangle,
  MapPin,
  Camera,
  Bot,
  Sparkles,
  CheckCircle2,
  Navigation,
  ArrowRight,
  RefreshCw,
  Info,
  Lock,
  EyeOff,
  UserCheck,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { DemoBadge } from "@/components/DemoBadge";
import { SeverityPill } from "@/components/SeverityPill";
import { CategoryPill } from "@/components/CategoryPill";
import {
  ILORIN_AREAS,
  type Severity,
  type IncidentCategory,
  CATEGORIES,
} from "@/lib/floodguard-data";
import { useReports } from "@/lib/reports-context";
import { analyzeCommunityReport, type ReportAnalysisResult } from "@/lib/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/report")({
  component: ReportPage,
});

const WATER_LEVELS = [
  "Puddles (Surface water)",
  "Ankle-deep (approx 15cm)",
  "Knee-deep (approx 45cm)",
  "Waist-deep (approx 90cm)",
  "Above waist (Surging flood)",
];

function ReportPage() {
  const { addReport, setSelectedReportForDetail } = useReports();

  // Form State
  const [category, setCategory] = useState<IncidentCategory>("flooding");
  const [title, setTitle] = useState("");
  const [area, setArea] = useState<string>("Tanke");
  const [street, setStreet] = useState("");
  const [waterLevel, setWaterLevel] = useState<string>(WATER_LEVELS[2]);
  const [hazardType, setHazardType] = useState("");
  const [severity, setSeverity] = useState<Severity>("high");
  const [description, setDescription] = useState("");
  const [photoSample, setPhotoSample] = useState<string>("street");
  const [gpsLocation, setGpsLocation] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | undefined>(
    undefined,
  );
  const [gpsLoading, setGpsLoading] = useState(false);

  // Privacy & Reporter info
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [reporterName, setReporterName] = useState("");
  const [contactPhonePrivate, setContactPhonePrivate] = useState("");
  const [isCoordinatesFuzzed, setIsCoordinatesFuzzed] = useState(false);

  // AI analysis state
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<ReportAnalysisResult | null>(null);

  // Submitted Confirmation state
  const [submittedReportId, setSubmittedReportId] = useState<string | null>(null);

  const selectedCategoryConfig = CATEGORIES[category] || CATEGORIES.flooding;

  const handleUseLocation = () => {
    setGpsLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setCoordinates({ lat, lng });
          setGpsLocation(`${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E (GPS Lock)`);
          setGpsLoading(false);
          toast.success("GPS coordinates acquired!");
        },
        () => {
          setCoordinates({ lat: 8.4966, lng: 4.5421 });
          setGpsLocation("8.4966° N, 4.5421° E (Estimated Ilorin)");
          setGpsLoading(false);
          toast.info("Using estimated Ilorin coordinates.");
        },
        { timeout: 6000 },
      );
    } else {
      setCoordinates({ lat: 8.4966, lng: 4.5421 });
      setGpsLocation("8.4966° N, 4.5421° E (Ilorin Center)");
      setGpsLoading(false);
    }
  };

  const handleAnalyzeWithAI = async () => {
    if (!description.trim() || description.length < 6) {
      toast.error("Please type an incident observation first.");
      return;
    }

    setAnalyzing(true);
    try {
      const res = await analyzeCommunityReport({
        data: {
          category,
          description,
          hasPhoto: Boolean(photoSample),
          hasDepth: category === "flooding" ? Boolean(waterLevel) : true,
          hasLocation: Boolean(street || area),
        },
      });

      if (res.ok && res.analysis) {
        setAiResult(res.analysis);
        if (res.analysis.category) {
          setCategory(res.analysis.category);
        }
        if (res.analysis.severity) {
          setSeverity(res.analysis.severity);
        }
        const sourceLabel = res.source === "gemini" ? "Gemini 2.5 Flash" : "offline heuristic";
        toast.success(`Incident evaluated via ${sourceLabel}! 🤖`);
      } else {
        toast.error("Could not run AI analysis, but you can still submit.");
      }
    } catch {
      toast.error("AI service offline. You can proceed with standard submission.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!street.trim()) {
      toast.error("Please enter a street name or landmark.");
      return;
    }

    if (!description.trim()) {
      toast.error("Please provide an incident observation.");
      return;
    }

    let photoUrl: string | undefined = undefined;
    if (photoSample === "street") photoUrl = "/assets/report-street.jpg";
    if (photoSample === "river") photoUrl = "/assets/report-bridge-overflow.jpg";
    if (photoSample === "drainage") photoUrl = "/assets/report-drainage.jpg";
    if (photoSample === "waste") photoUrl = "/assets/report-waste-choke.jpg";
    if (photoSample === "road") photoUrl = "/assets/report-road-sinkhole.jpg";
    if (photoSample === "utility") photoUrl = "/assets/report-utility-wire.jpg";
    if (photoSample === "drain") photoUrl = "/assets/report-open-drain.jpg";

    const newReport = addReport({
      title: title.trim() || `${selectedCategoryConfig.shortLabel} Hazard at ${street}, ${area}`,
      category,
      severity,
      location: area,
      street: street.trim(),
      description: description.trim(),
      waterLevel: category === "flooding" ? waterLevel : undefined,
      hazardType: hazardType.trim() || selectedCategoryConfig.shortLabel,
      photoUrl,
      isAnonymous,
      reporterName: reporterName.trim() || undefined,
      contactPhonePrivate: contactPhonePrivate.trim() || undefined,
      coordinates,
      isCoordinatesFuzzed,
    });

    setSubmittedReportId(newReport.id);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🚨</span>
          <h1 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
            Report a Community Incident
          </h1>
          <DemoBadge />
        </div>
        <p className="mt-2 text-sm font-semibold text-muted-foreground max-w-2xl">
          Submit verified observations of flooding, damaged infrastructure, sanitation blockages, or
          electrical hazards. Your report helps neighbors stay safe and alerts civil responders.
        </p>
      </div>

      {submittedReportId ? (
        /* Confirmation Screen */
        <div className="rounded-3xl border-2 border-primary/30 bg-gradient-to-b from-primary/10 via-card to-card p-8 text-center shadow-xl space-y-6">
          <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-primary/20 text-4xl shadow-inner">
            🎉
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-3xl font-extrabold text-foreground">
              Report Successfully Recorded to Community Verification Ledger
            </h2>
            <p className="text-sm font-semibold text-muted-foreground max-w-lg mx-auto">
              Thank you for contributing to community safety! Your report has been assigned a unique
              tracking ID and queued for community review.
            </p>
          </div>

          <div className="mx-auto max-w-md rounded-2xl border border-border bg-background p-4 text-left text-xs font-semibold space-y-2.5">
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Tracking ID:</span>
              <span className="font-mono font-extrabold text-primary">{submittedReportId}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Category:</span>
              <CategoryPill category={category} />
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Location:</span>
              <span className="font-bold text-foreground">
                {street}, {area}
              </span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Recommended Civic Responder:</span>
              <span className="font-bold text-foreground">
                {selectedCategoryConfig.defaultResponder}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Points Earned:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                +20 Community Points 🌟
              </span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground shadow hover:bg-primary/90"
            >
              <FileText className="size-4" /> View Verification Dashboard
            </Link>

            <Link
              to="/map"
              className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-6 py-3 text-sm font-extrabold text-foreground hover:bg-muted"
            >
              <Navigation className="size-4 text-primary" /> View on Incident Map
            </Link>

            <button
              type="button"
              onClick={() => {
                setSubmittedReportId(null);
                setTitle("");
                setStreet("");
                setDescription("");
                setAiResult(null);
              }}
              className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-5 py-3 text-xs font-bold text-muted-foreground hover:text-foreground"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      ) : (
        /* The Comprehensive Multi-Category Form */
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-7"
        >
          {/* Step 1: Category Selection */}
          <div>
            <label className="block text-xs font-extrabold text-foreground mb-2">
              1. Select Incident Category <span className="text-destructive">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {(Object.keys(CATEGORIES) as IncidentCategory[]).map((catKey) => {
                const cat = CATEGORIES[catKey];
                const isSelected = category === catKey;
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => setCategory(catKey)}
                    className={`flex flex-col items-center justify-center rounded-2xl border p-3.5 text-center transition-all ${
                      isSelected
                        ? "border-primary bg-primary/10 ring-2 ring-primary shadow-sm"
                        : "border-border bg-background hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="text-2xl mb-1">{cat.emoji}</span>
                    <span className="text-xs font-extrabold text-foreground">{cat.shortLabel}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs font-medium text-muted-foreground">
              {selectedCategoryConfig.description}
            </p>
          </div>

          {/* Step 2: Location & Street */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-extrabold text-foreground">
                2. Neighborhood / Area <span className="text-destructive">*</span>
              </label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="mt-1.5 w-full rounded-2xl border border-input bg-background px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-primary"
              >
                {ILORIN_AREAS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-foreground">
                Specific Street Name or Landmark <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Tipper Garage Junction, Old Jebba Road"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="mt-1.5 w-full rounded-2xl border border-input bg-background px-4 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Step 3: Dynamic Category-Specific Fields */}
          {category === "flooding" && (
            <div>
              <label className="block text-xs font-extrabold text-foreground mb-2">
                Estimated Flood Depth <span className="text-destructive">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {WATER_LEVELS.map((lvl) => {
                  const isSelected = waterLevel === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setWaterLevel(lvl)}
                      className={`rounded-2xl border p-3 text-center text-xs font-bold transition-all ${
                        isSelected
                          ? "border-sky-500 bg-sky-500/15 text-sky-700 dark:text-sky-300 ring-2 ring-sky-500/40 shadow-sm"
                          : "border-border bg-background text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <div className="text-lg mb-1">
                        {lvl.includes("Puddles") && "💧"}
                        {lvl.includes("Ankle") && "🦶"}
                        {lvl.includes("Knee") && "🦵"}
                        {lvl.includes("Waist") && "🩳"}
                        {lvl.includes("Above") && "⚠️"}
                      </div>
                      <span className="line-clamp-2">{lvl}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {category !== "flooding" && (
            <div>
              <label className="block text-xs font-extrabold text-foreground mb-1.5">
                Specific Hazard Type / Sub-classification
              </label>
              <input
                type="text"
                placeholder="e.g., Collapsed culvert wall, Live low-tension wire, Blocked drainage canal..."
                value={hazardType}
                onChange={(e) => setHazardType(e.target.value)}
                className="w-full rounded-2xl border border-input bg-background px-4 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-primary"
              />
            </div>
          )}

          {/* Step 4: Observed Severity */}
          <div>
            <label className="block text-xs font-extrabold text-foreground mb-2">
              Observed Severity Level <span className="text-destructive">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(["low", "moderate", "high", "critical"] as Severity[]).map((sev) => {
                const isSelected = severity === sev;
                return (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSeverity(sev)}
                    className={`rounded-2xl border p-3 text-center text-xs font-bold capitalize transition-all ${
                      isSelected
                        ? "border-primary bg-primary/10 ring-2 ring-primary shadow-sm"
                        : "border-border bg-background text-muted-foreground hover:bg-muted/40"
                    }`}
                  >
                    <SeverityPill severity={sev} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 5: Title & Detailed Observation + AI Assistant Check */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-extrabold text-foreground mb-1.5">
                Incident Headline / Short Title
              </label>
              <input
                type="text"
                placeholder="e.g., Rising floodwaters blocking University Road near Tipper Garage"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-2xl border border-input bg-background px-4 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-foreground">
                  Detailed Observation <span className="text-destructive">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleAnalyzeWithAI}
                  disabled={analyzing}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-purple-500/15 px-3 py-1 text-xs font-extrabold text-purple-700 dark:text-purple-300 transition-colors hover:bg-purple-500/25 disabled:opacity-60"
                >
                  {analyzing ? (
                    <>
                      <RefreshCw className="size-3.5 animate-spin" /> Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <Bot className="size-3.5" /> 🤖 Check Report Credibility with AI
                    </>
                  )}
                </button>
              </div>

              <textarea
                required
                rows={4}
                placeholder="Describe what you see: water depth, stalled vehicles, broken pavement, exposed wires, or whether people are trapped..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-2xl border border-input bg-background p-4 text-sm font-medium focus:ring-2 focus:ring-primary"
              />

              {/* AI Analysis Feedback & Guidance Card */}
              {aiResult && (
                <div className="rounded-2xl border border-purple-500/30 bg-purple-500/10 p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-xs font-extrabold text-purple-900 dark:text-purple-200">
                      <Sparkles className="size-4 text-purple-600 dark:text-purple-400" />
                      TrustReport AI Assessment
                    </span>
                    <div className="flex items-center gap-1.5">
                      {aiResult.source === "gemini" ? (
                        <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800 dark:text-emerald-300">
                          ✨ Gemini 2.5 Flash
                        </span>
                      ) : (
                        <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[10px] font-extrabold text-amber-800 dark:text-amber-300">
                          ⚙️ Offline Rule-Based Fallback
                        </span>
                      )}
                      <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-[10px] font-extrabold text-purple-900 dark:text-purple-100">
                        Est. Credibility: {aiResult.credibilityRating}%
                      </span>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-purple-950 dark:text-purple-100 leading-relaxed">
                    {aiResult.why}
                  </p>

                  <div className="rounded-xl bg-card/80 border border-purple-500/20 p-2.5 text-xs text-purple-950 dark:text-purple-100">
                    <strong>Recommended Safety Advice: </strong> {aiResult.action}
                  </div>

                  {aiResult.missing && aiResult.missing.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] pt-1">
                      <span className="font-bold text-purple-900 dark:text-purple-200">
                        Information to improve credibility:
                      </span>
                      {aiResult.missing.map((tip) => (
                        <span
                          key={tip}
                          className="rounded-lg bg-card px-2 py-0.5 font-semibold text-foreground shadow-sm"
                        >
                          + {tip}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Step 6: Photo Evidence Selection */}
          <div>
            <label className="block text-xs font-extrabold text-foreground mb-2">
              Attach Evidence Photo (Optional)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                {
                  id: "street",
                  title: "Street Flood / Overflow",
                  img: "/assets/report-street.jpg",
                },
                {
                  id: "river",
                  title: "River Surge / Bridge",
                  img: "/assets/report-bridge-overflow.jpg",
                },
                {
                  id: "drainage",
                  title: "Blocked Gutter / Silt",
                  img: "/assets/report-drainage.jpg",
                },
                {
                  id: "waste",
                  title: "Canal Waste Choke",
                  img: "/assets/report-waste-choke.jpg",
                },
                {
                  id: "road",
                  title: "Road Collapse / Gully",
                  img: "/assets/report-road-sinkhole.jpg",
                },
                {
                  id: "utility",
                  title: "Fallen Cable / Utility",
                  img: "/assets/report-utility-wire.jpg",
                },
              ].map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => setPhotoSample(sample.id)}
                  className={`group relative aspect-video overflow-hidden rounded-2xl border-2 transition-all ${
                    photoSample === sample.id
                      ? "border-primary ring-2 ring-primary/50"
                      : "border-border opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={sample.img}
                    alt={sample.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute bottom-1 left-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {sample.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 7: GPS Coordinates */}
          <div className="flex flex-wrap items-center justify-between rounded-2xl bg-muted/40 p-4 text-xs gap-3">
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" />
              <span>
                {gpsLocation ? (
                  <strong className="text-foreground">{gpsLocation}</strong>
                ) : (
                  <span className="text-muted-foreground">No GPS lock attached</span>
                )}
              </span>
            </div>
            <button
              type="button"
              onClick={handleUseLocation}
              disabled={gpsLoading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 font-bold hover:bg-accent"
            >
              <Navigation className="size-3.5 text-primary" />
              {gpsLoading ? "Locating..." : "Attach My Current GPS"}
            </button>
          </div>

          {/* Step 8: Privacy & Responsible Data Handling */}
          <div className="rounded-2xl border border-border bg-muted/30 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="size-4 text-primary" />
                <span className="text-xs font-extrabold text-foreground">
                  Privacy & Responsible Data Handling
                </span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="size-4 rounded border-input text-primary focus:ring-primary"
                />
                <span className="text-xs font-bold text-foreground">Submit Anonymously</span>
              </label>
            </div>

            {!isAnonymous ? (
              <div className="grid gap-3 sm:grid-cols-2 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                    Your Name / Observer Alias
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Tunde O. (Community Member)"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background p-2.5 text-xs font-semibold focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                    Private Phone Number (Strictly Hidden)
                  </label>
                  <input
                    type="tel"
                    placeholder="Optional: for official verification only"
                    value={contactPhonePrivate}
                    onChange={(e) => setContactPhonePrivate(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background p-2.5 text-xs font-semibold focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            ) : (
              <p className="text-xs font-medium text-muted-foreground">
                Your report will be credited to "Anonymous Resident" and no personal contact details
                will be requested or saved.
              </p>
            )}

            <div className="flex items-start gap-2.5 rounded-xl border border-border bg-card p-3">
              <input
                id="fuzz-coords-checkbox"
                type="checkbox"
                checked={isCoordinatesFuzzed}
                onChange={(e) => setIsCoordinatesFuzzed(e.target.checked)}
                className="size-4 mt-0.5 rounded border-input text-primary focus:ring-primary"
              />
              <label htmlFor="fuzz-coords-checkbox" className="text-xs space-y-0.5 cursor-pointer">
                <span className="font-extrabold text-foreground block">
                  📍 Fuzz exact coordinates (~300m radius) for resident privacy
                </span>
                <span className="text-[11px] font-medium text-muted-foreground block leading-relaxed">
                  Applies a localized spatial offset so your exact residential property is not
                  publicly exposed on the map, while still maintaining neighborhood-level safety
                  awareness.
                </span>
              </label>
            </div>

            <p className="text-[11px] font-medium text-muted-foreground border-t border-border pt-2">
              🛡️ <strong>Trust Guarantee:</strong> Personal telephone numbers and identities are
              never publicly visible. Data is stored solely to prevent false reporting and
              coordinate civil response.
            </p>
          </div>

          {/* Submission Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-destructive px-6 py-4 text-base font-extrabold text-destructive-foreground shadow-lg transition-transform hover:scale-[1.01] active:scale-95"
            >
              <AlertTriangle className="size-5" /> Submit Incident to Community Ledger (+20 pts)
            </button>
            <p className="mt-2 text-center text-[11px] font-semibold text-muted-foreground">
              ⚠️ In an active life-threatening emergency, always call Kwara State Fire and Emergency
              Services directly on 0803 323 1122.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
