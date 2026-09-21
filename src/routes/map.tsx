import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  MapPin,
  Compass,
  AlertTriangle,
  CheckCircle2,
  ThumbsUp,
  Navigation,
  Info,
  Layers,
  Search,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  ExternalLink,
  Filter,
} from "lucide-react";
import { DemoBadge, DemoNotice } from "@/components/DemoBadge";
import { SeverityPill } from "@/components/SeverityPill";
import { CategoryPill } from "@/components/CategoryPill";
import { VerificationBadge } from "@/components/VerificationBadge";
import { StatusBadge } from "@/components/StatusBadge";
import {
  ILORIN_AREAS,
  AREA_RISK,
  CATEGORIES,
  type IncidentCategory,
  type IncidentReport,
  type Severity,
} from "@/lib/floodguard-data";
import { useReports } from "@/lib/reports-context";
import { toast } from "sonner";

export const Route = createFileRoute("/map")({
  component: MapPage,
});

// Connections between areas for routing visualization
const NEIGHBORHOOD_CONNECTIONS: Array<[string, string]> = [
  ["Maraba", "Taiwo"],
  ["Taiwo", "Adewole"],
  ["Taiwo", "Basin"],
  ["Basin", "Challenge"],
  ["Challenge", "Tanke"],
  ["Tanke", "Oke-Odo"],
  ["Sango", "GRA"],
  ["GRA", "Fate"],
  ["Fate", "Basin"],
  ["Kulende", "Sango"],
  ["Pakata", "Adewole"],
  ["Pakata", "Taiwo"],
];

function MapPage() {
  const { reports, confirmReport, setSelectedReportForDetail } = useReports();

  const [selectedReportId, setSelectedReportId] = useState<string | null>("TR-ILR-2048");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Route finder state
  const [fromArea, setFromArea] = useState<string>("Tanke");
  const [toArea, setToArea] = useState<string>("GRA");
  const [routeResult, setRouteResult] = useState<{
    directStatus: "safe" | "caution" | "danger";
    directPath: string[];
    altPath?: string[];
    notes: string;
  } | null>(null);

  const selectedReport = useMemo(
    () => reports.find((r) => r.id === selectedReportId) ?? reports[0] ?? null,
    [reports, selectedReportId],
  );

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchCategory = categoryFilter === "all" || r.category === categoryFilter;
      const matchSeverity = severityFilter === "all" || r.severity === severityFilter;
      const matchSearch =
        searchQuery.trim() === "" ||
        r.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.street.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSeverity && matchSearch;
    });
  }, [reports, categoryFilter, severityFilter, searchQuery]);

  const handleEvaluateRoute = () => {
    if (fromArea === toArea) {
      toast.error("Please pick different origin and destination areas");
      return;
    }

    const fromRisk = AREA_RISK[fromArea] ?? "low";
    const toRisk = AREA_RISK[toArea] ?? "low";
    const hasHighOrCritical =
      fromRisk === "high" || fromRisk === "critical" || toRisk === "high" || toRisk === "critical";

    if (fromArea === "Tanke" && toArea === "GRA") {
      setRouteResult({
        directStatus: "caution",
        directPath: ["Tanke", "Basin (Choked Drains & Rising Runoff)", "Fate", "GRA"],
        altPath: ["Tanke", "Oke-Odo", "Kulende Bypass", "GRA"],
        notes:
          "⚠️ High hazard reported along Corridor A via Basin Junction (overflow and damaged culvert). Recommended safe alternative: Route B via Oke-Odo/Kulende bypass on higher elevation.",
      });
    } else if (hasHighOrCritical) {
      setRouteResult({
        directStatus: "danger",
        directPath: [fromArea, "Direct Primary Corridor", toArea],
        altPath: [fromArea, "Higher Elevation Ring Road Bypass", toArea],
        notes: `⚠️ High incident density in ${fromRisk === "critical" || fromRisk === "high" ? fromArea : toArea}. Take the outer perimeter road, avoid driving through underpasses, and never cross standing or rushing water.`,
      });
    } else {
      setRouteResult({
        directStatus: "safe",
        directPath: [fromArea, toArea],
        notes: `🟢 Standard transit path between ${fromArea} and ${toArea}. Drains and roadways are currently operating normally along this corridor. Stay vigilant during sudden downpours.`,
      });
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🗺️</span>
            <h1 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
              Ilorin Community Incident Map
            </h1>
            <DemoBadge />
          </div>
          <p className="mt-1 text-sm font-semibold text-muted-foreground">
            Interactive GIS layout showing verified flood zones, culvert blocks, utility hazards,
            and safer route alternatives.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setCategoryFilter("all");
              setSeverityFilter("all");
              setSearchQuery("");
              if (reports.length > 0) setSelectedReportId(reports[0].id);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-bold hover:bg-accent"
          >
            <RotateCcw className="size-3.5" /> Reset Filters
          </button>
        </div>
      </div>

      {/* Demo Notice Banner */}
      <DemoNotice>
        <strong>⚠️ Prototype Demonstration Only:</strong> This map displays sample locations and
        verified simulated reports for educational and testing purposes. In active emergencies,
        always contact official Kwara State emergency numbers.
      </DemoNotice>

      {/* Main Grid: Controls + Interactive Map + Detail Panel */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Filters & Safer Route Tool (4 cols) */}
        <div className="space-y-6 lg:col-span-4">
          {/* Filter Card */}
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm space-y-4">
            <h2 className="font-display text-base font-extrabold flex items-center gap-2">
              <Layers className="size-4 text-primary" /> Filter Incident Markers
            </h2>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search area, street, or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-input bg-background pl-9 pr-3 py-2 text-xs font-semibold placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Category Dropdown */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground">Incident Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-bold"
              >
                <option value="all">All Categories ({reports.length})</option>
                <option value="flooding">🌊 Flooding</option>
                <option value="infrastructure">🏗️ Infrastructure</option>
                <option value="sanitation">🗑️ Blocked Drainage</option>
                <option value="utility">⚡ Utility Outages</option>
                <option value="safety">🛡️ Public Safety</option>
              </select>
            </div>

            {/* Severity Tabs */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground">Severity</label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setSeverityFilter("all")}
                  className={`rounded-xl px-2.5 py-1.5 text-xs font-bold transition-colors ${
                    severityFilter === "all"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  All ({filteredReports.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSeverityFilter("critical")}
                  className={`rounded-xl px-2.5 py-1.5 text-xs font-bold transition-colors ${
                    severityFilter === "critical"
                      ? "bg-red-600 text-white"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  🔴 Critical
                </button>
                <button
                  type="button"
                  onClick={() => setSeverityFilter("high")}
                  className={`rounded-xl px-2.5 py-1.5 text-xs font-bold transition-colors ${
                    severityFilter === "high"
                      ? "bg-orange-500 text-white"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  🟠 High
                </button>
                <button
                  type="button"
                  onClick={() => setSeverityFilter("moderate")}
                  className={`rounded-xl px-2.5 py-1.5 text-xs font-bold transition-colors ${
                    severityFilter === "moderate"
                      ? "bg-yellow-500 text-slate-900"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  🟡 Moderate
                </button>
              </div>
            </div>

            {/* Showing Count */}
            <div className="rounded-2xl bg-muted/40 p-3 text-xs font-semibold flex justify-between">
              <span className="text-muted-foreground">Showing Map Markers:</span>
              <strong className="text-foreground">{filteredReports.length}</strong>
            </div>
          </div>

          {/* Safer Route Tool */}
          <div className="rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-extrabold flex items-center gap-2">
                <Navigation className="size-4 text-primary" /> Safer Route Advisor
              </h2>
              <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-extrabold text-primary">
                Civic Routing
              </span>
            </div>

            <p className="text-xs font-medium text-muted-foreground">
              Check potential flood choke-points and hazard obstructions between two Ilorin areas
              before travelling.
            </p>

            <div className="grid gap-2.5">
              <div>
                <label className="text-[11px] font-bold text-muted-foreground">Origin (From)</label>
                <select
                  value={fromArea}
                  onChange={(e) => setFromArea(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-bold"
                >
                  {ILORIN_AREAS.map((a) => (
                    <option key={a} value={a}>
                      {a} ({AREA_RISK[a] ?? "low"})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-muted-foreground">
                  Destination (To)
                </label>
                <select
                  value={toArea}
                  onChange={(e) => setToArea(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-bold"
                >
                  {ILORIN_AREAS.map((a) => (
                    <option key={a} value={a}>
                      {a} ({AREA_RISK[a] ?? "low"})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleEvaluateRoute}
                className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-extrabold text-primary-foreground shadow transition-transform hover:scale-[1.02] active:scale-95"
              >
                <Compass className="size-4" /> Calculate Safe Travel Path
              </button>
            </div>

            {routeResult && (
              <div
                className={`rounded-2xl border p-3.5 text-xs font-semibold space-y-2 ${
                  routeResult.directStatus === "danger"
                    ? "border-red-500/40 bg-red-500/10 text-red-900 dark:text-red-200"
                    : routeResult.directStatus === "caution"
                      ? "border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200"
                      : "border-emerald-500/40 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200"
                }`}
              >
                <p>{routeResult.notes}</p>

                {routeResult.altPath && (
                  <div className="mt-2 rounded-xl bg-card/80 p-2.5 text-foreground space-y-1">
                    <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 block">
                      🛡️ Suggested Higher-Ground Bypass:
                    </span>
                    <div className="flex flex-wrap items-center gap-1 font-bold text-[11px]">
                      {routeResult.altPath.map((step, idx) => (
                        <span key={step} className="flex items-center gap-1">
                          <span className="rounded bg-muted px-1.5 py-0.5">{step}</span>
                          {idx < routeResult.altPath!.length - 1 && (
                            <ArrowRight className="size-3 text-muted-foreground" />
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Center & Right Column: Interactive Map & Report Details (8 cols) */}
        <div className="space-y-6 lg:col-span-8">
          {/* Vector Map Canvas */}
          <div className="relative overflow-hidden rounded-3xl border-2 border-border bg-slate-900 text-slate-100 shadow-xl">
            {/* Map Header Overlay */}
            <div className="absolute left-4 top-4 z-10 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-slate-950/80 px-3 py-1 text-xs font-extrabold text-slate-200 shadow backdrop-blur">
                📍 Ilorin Metropolitan GIS Grid
              </span>
              <span className="rounded-full bg-primary/20 px-2.5 py-1 text-xs font-bold text-primary-foreground backdrop-blur">
                Click any pin to inspect
              </span>
            </div>

            {/* SVG Visual Canvas */}
            <div className="relative aspect-[16/11] w-full select-none overflow-hidden sm:aspect-[16/10]">
              <svg viewBox="0 0 100 100" className="h-full w-full">
                <defs>
                  <pattern id="mapgrid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path
                      d="M 10 0 L 0 0 0 10"
                      fill="none"
                      stroke="rgba(255,255,255,0.04)"
                      strokeWidth="0.5"
                    />
                  </pattern>

                  <linearGradient id="riverGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#0369a1" stopOpacity="0.7" />
                  </linearGradient>
                </defs>

                {/* Background Grid */}
                <rect width="100" height="100" fill="url(#mapgrid)" />

                {/* Asa River & drainage channels running through Ilorin */}
                <path
                  d="M 15 0 Q 30 25 38 45 T 60 80 T 85 100"
                  fill="none"
                  stroke="url(#riverGrad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                {/* Secondary canal */}
                <path
                  d="M 65 20 Q 55 45 42 50 T 25 85"
                  fill="none"
                  stroke="url(#riverGrad)"
                  strokeWidth="2.5"
                  strokeDasharray="2,2"
                />

                {/* Major Connecting Arterial Roads */}
                {NEIGHBORHOOD_CONNECTIONS.map(([a, b], idx) => {
                  const rA = reports.find((r) => r.location === a);
                  const rB = reports.find((r) => r.location === b);
                  if (!rA?.coordinates || !rB?.coordinates) return null;
                  return (
                    <line
                      key={idx}
                      x1={rA.coordinates.x}
                      y1={rA.coordinates.y}
                      x2={rB.coordinates.x}
                      y2={rB.coordinates.y}
                      stroke="rgba(255,255,255,0.15)"
                      strokeWidth="1.2"
                      strokeDasharray="1.5,1.5"
                    />
                  );
                })}

                {/* River label */}
                <text
                  x="32"
                  y="38"
                  fill="#38bdf8"
                  fontSize="2.2"
                  fontWeight="bold"
                  opacity="0.7"
                  transform="rotate(35, 32, 38)"
                >
                  Asa River Drainage Basin ≋
                </text>
              </svg>

              {/* Interactive Markers Placed by Relative (x, y) */}
              {filteredReports.map((report) => {
                const isSelected = report.id === selectedReportId;
                const posX = report.coordinates?.x ?? 50;
                const posY = report.coordinates?.y ?? 50;

                return (
                  <button
                    key={report.id}
                    type="button"
                    onClick={() => setSelectedReportId(report.id)}
                    style={{ left: `${posX}%`, top: `${posY}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
                    aria-label={`View report for ${report.location}`}
                  >
                    {/* Pulsing ring for critical/high */}
                    {(report.severity === "critical" || report.severity === "high") && (
                      <span
                        className={`absolute inset-0 size-7 -translate-x-1.5 -translate-y-1.5 rounded-full animate-ping opacity-60 ${
                          report.severity === "critical" ? "bg-red-500" : "bg-orange-500"
                        }`}
                      />
                    )}

                    <div
                      className={`relative flex items-center justify-center rounded-full transition-all ${
                        isSelected
                          ? "size-8 ring-4 ring-white shadow-xl scale-125 z-30"
                          : "size-6 ring-2 ring-slate-900 hover:scale-110 z-20"
                      } ${
                        report.severity === "critical"
                          ? "bg-red-600 text-white"
                          : report.severity === "high"
                            ? "bg-orange-500 text-white"
                            : report.severity === "moderate"
                              ? "bg-yellow-400 text-slate-950"
                              : "bg-emerald-500 text-white"
                      }`}
                    >
                      <span className="text-xs">
                        {report.category === "flooding" && "🌊"}
                        {report.category === "infrastructure" && "🏗️"}
                        {report.category === "sanitation" && "🗑️"}
                        {report.category === "utility" && "⚡"}
                        {report.category === "safety" && "🛡️"}
                      </span>
                    </div>

                    {/* Area Name Tag */}
                    <span
                      className={`absolute left-1/2 -translate-x-1/2 top-full mt-1 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[9px] font-extrabold shadow backdrop-blur transition-all ${
                        isSelected
                          ? "bg-white text-slate-900 font-black scale-110 z-30"
                          : "bg-slate-950/85 text-slate-200 group-hover:bg-slate-900 z-10"
                      }`}
                    >
                      {report.location}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Map Legend Bar */}
            <div className="flex flex-wrap items-center justify-between border-t border-slate-800 bg-slate-950/90 px-4 py-2.5 text-[11px] font-bold text-slate-300 gap-2">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-emerald-500" /> Low/Safe
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-yellow-400" /> Moderate
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-orange-500" /> High
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-red-500" /> Critical
                </span>
              </div>
              <span className="text-[10px] text-slate-400">12 Kwara Districts Monitored</span>
            </div>
          </div>

          {/* Selected Report Inspection Card */}
          {selectedReport && (
            <div className="rounded-3xl border border-border bg-card p-6 shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-muted-foreground">
                      {selectedReport.id}
                    </span>
                    <CategoryPill category={selectedReport.category} />
                    <SeverityPill severity={selectedReport.severity} />
                    <VerificationBadge status={selectedReport.verificationStatus} />
                  </div>
                  <h3 className="font-display text-2xl font-extrabold text-foreground mt-2">
                    {selectedReport.title}
                  </h3>
                  <p className="flex items-center gap-1 text-xs font-bold text-muted-foreground mt-1">
                    <MapPin className="size-3.5 text-primary" /> {selectedReport.street},{" "}
                    {selectedReport.location}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => confirmReport(selectedReport.id)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-extrabold hover:bg-muted"
                  >
                    <ThumbsUp className="size-3.5 text-primary" />
                    Confirm ({selectedReport.confirmations})
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedReportForDetail(selectedReport)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-extrabold text-primary-foreground hover:bg-primary/90"
                  >
                    Inspect Audit Log <ExternalLink className="size-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-12 items-center">
                {selectedReport.photoUrl && (
                  <div className="sm:col-span-5 aspect-video overflow-hidden rounded-2xl bg-muted">
                    <img
                      src={selectedReport.photoUrl}
                      alt={selectedReport.street}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src.includes("/src/assets/")) {
                          target.src = target.src.replace("/src/assets/", "/assets/");
                        }
                      }}
                    />
                  </div>
                )}

                <div
                  className={
                    selectedReport.photoUrl ? "sm:col-span-7 space-y-3" : "sm:col-span-12 space-y-3"
                  }
                >
                  <p className="text-sm text-foreground/90 font-medium leading-relaxed">
                    {selectedReport.description}
                  </p>

                  <div className="rounded-2xl bg-muted/60 p-3 text-xs font-semibold space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Assigned Civil Responder:</span>
                      <strong className="text-foreground">
                        {selectedReport.assignedResponder}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Trust Credibility Index:</span>
                      <strong className="text-primary">{selectedReport.credibilityScore}%</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
