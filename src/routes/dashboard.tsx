import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  BarChart3,
  PieChart as PieIcon,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Search,
  ArrowUpDown,
  Download,
  Calendar,
  ShieldCheck,
  Zap,
  RotateCcw,
  ExternalLink,
  ThumbsUp,
  Radio,
  FileCheck2,
  Clock,
  HelpCircle,
} from "lucide-react";
import { DemoBadge } from "@/components/DemoBadge";
import { CountUp } from "@/components/CountUp";
import { SeverityPill } from "@/components/SeverityPill";
import { CategoryPill } from "@/components/CategoryPill";
import { VerificationBadge } from "@/components/VerificationBadge";
import { StatusBadge } from "@/components/StatusBadge";
import {
  ILORIN_AREAS,
  type Severity,
  type IncidentCategory,
  type IncidentStatus,
  type VerificationStatus,
  CATEGORIES,
} from "@/lib/floodguard-data";
import { useReports } from "@/lib/reports-context";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

export function DashboardPage() {
  const {
    reports,
    stats,
    isReviewerMode,
    toggleReviewerMode,
    hasUserConfirmed,
    isLowBandwidth,
    setIsLowBandwidth,
    confirmReport,
    setSelectedReportForDetail,
    resetToDefaults,
  } = useReports();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [verificationFilter, setVerificationFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "confirmations" | "trust">("trust");

  // Dynamic Chart calculations from state
  const areaChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const area of ILORIN_AREAS) {
      counts[area] = 0;
    }
    for (const r of reports) {
      counts[r.location] = (counts[r.location] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([area, count]) => ({ area, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [reports]);

  const categoryChartData = useMemo(() => {
    const counts: Record<IncidentCategory, number> = {
      flooding: 0,
      infrastructure: 0,
      sanitation: 0,
      utility: 0,
      safety: 0,
    };
    for (const r of reports) {
      counts[r.category] = (counts[r.category] || 0) + 1;
    }
    return [
      { name: "Flooding", value: counts.flooding, color: "#0284c7" },
      { name: "Infrastructure", value: counts.infrastructure, color: "#ea580c" },
      { name: "Sanitation", value: counts.sanitation, color: "#16a34a" },
      { name: "Utility", value: counts.utility, color: "#ca8a04" },
      { name: "Safety", value: counts.safety, color: "#9333ea" },
    ];
  }, [reports]);

  const filteredReports = useMemo(() => {
    return reports
      .filter((r) => {
        const matchCategory = categoryFilter === "all" || r.category === categoryFilter;
        const matchSev = severityFilter === "all" || r.severity === severityFilter;
        const matchVerif =
          verificationFilter === "all" || r.verificationStatus === verificationFilter;
        const matchStatus = statusFilter === "all" || r.status === statusFilter;
        const matchSearch =
          search.trim() === "" ||
          r.title.toLowerCase().includes(search.toLowerCase()) ||
          r.location.toLowerCase().includes(search.toLowerCase()) ||
          r.street.toLowerCase().includes(search.toLowerCase()) ||
          r.id.toLowerCase().includes(search.toLowerCase());

        return matchCategory && matchSev && matchVerif && matchStatus && matchSearch;
      })
      .sort((a, b) => {
        if (sortBy === "confirmations") return b.confirmations - a.confirmations;
        if (sortBy === "trust") return b.credibilityScore - a.credibilityScore;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [reports, search, categoryFilter, severityFilter, verificationFilter, statusFilter, sortBy]);

  const handleExportData = () => {
    // Generate actual CSV content
    const headers = [
      "ID",
      "Title",
      "Category",
      "Severity",
      "Location",
      "Street",
      "Status",
      "VerificationStatus",
      "CredibilityScore",
      "Confirmations",
      "CreatedAt",
    ];
    const rows = reports.map((r) => [
      r.id,
      `"${r.title.replace(/"/g, '""')}"`,
      r.category,
      r.severity,
      `"${r.location}"`,
      `"${r.street.replace(/"/g, '""')}"`,
      r.status,
      r.verificationStatus,
      r.credibilityScore,
      r.confirmations,
      r.createdAt,
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `TrustReport_Ilorin_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Incident audit logs exported as CSV!");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
      {/* Top Header & Toggles */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <h1 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
              Verification & Analytics Dashboard
            </h1>
            <DemoBadge />
          </div>
          <p className="mt-1 text-sm font-semibold text-muted-foreground">
            Information Credibility Ledger · Community Verification Queue · Ilorin Incidents
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Low bandwidth mode toggle */}
          <button
            type="button"
            onClick={() => setIsLowBandwidth(!isLowBandwidth)}
            className={`inline-flex items-center gap-1.5 rounded-2xl border px-3.5 py-2 text-xs font-extrabold transition-all ${
              isLowBandwidth
                ? "border-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-300"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            <Zap className="size-3.5" />
            <span>Low-Bandwidth Mode: {isLowBandwidth ? "ON" : "OFF"}</span>
          </button>

          {/* Reviewer Audit toggle */}
          <button
            type="button"
            onClick={toggleReviewerMode}
            className={`inline-flex items-center gap-1.5 rounded-2xl border px-3.5 py-2 text-xs font-extrabold transition-all ${
              isReviewerMode
                ? "border-purple-500 bg-purple-500/20 text-purple-700 dark:text-purple-300 shadow-sm"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShieldCheck className="size-3.5 text-purple-600 dark:text-purple-400" />
            <span>Reviewer Mode: {isReviewerMode ? "ACTIVE" : "OFF"}</span>
          </button>

          {/* Export CSV */}
          <button
            type="button"
            onClick={handleExportData}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-border bg-card px-3.5 py-2 text-xs font-extrabold text-foreground hover:bg-accent"
          >
            <Download className="size-3.5" /> Export Data
          </button>

          <button
            type="button"
            onClick={resetToDefaults}
            title="Reset to default prototype records"
            className="inline-flex items-center gap-1.5 rounded-2xl border border-border bg-card p-2 text-xs font-bold text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Reviewer Mode Banner if enabled */}
      {isReviewerMode && (
        <div className="flex flex-wrap items-center justify-between rounded-2xl border border-purple-500/40 bg-purple-500/10 p-4 text-xs font-semibold text-purple-950 dark:text-purple-100 gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-purple-600 dark:text-purple-400" />
            <span>
              <strong>Reviewer Audit Mode Active:</strong> You can click any incident row to inspect
              audit logs, verify reports, update dispatch statuses, or flag disputed claims.
            </span>
          </div>
          <span className="rounded-full bg-purple-500/20 px-3 py-1 text-[11px] font-extrabold">
            Civil Observer Role
          </span>
        </div>
      )}

      {/* 4 Summary Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-bold">
            <span>Total Incident Reports</span>
            <span className="text-xl">📋</span>
          </div>
          <div className="mt-2 font-display text-3xl font-extrabold text-foreground">
            <CountUp to={stats.total} />
          </div>
          <p className="mt-1 text-[11px] font-semibold text-muted-foreground">
            Logged across 12 Ilorin districts
          </p>
        </div>

        <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-5 shadow-sm">
          <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-200 text-xs font-bold">
            <span>Verified by Community / Observers</span>
            <span className="text-xl">🛡️</span>
          </div>
          <div className="mt-2 font-display text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            <CountUp to={stats.verified} />
          </div>
          <p className="mt-1 text-[11px] font-semibold text-emerald-900/80 dark:text-emerald-200/80">
            High credibility threshold reached
          </p>
        </div>

        <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-5 shadow-sm">
          <div className="flex items-center justify-between text-red-800 dark:text-red-200 text-xs font-bold">
            <span>Critical / High Severity Hazards</span>
            <span className="text-xl">⚠️</span>
          </div>
          <div className="mt-2 font-display text-3xl font-extrabold text-red-600 dark:text-red-400">
            <CountUp to={stats.critical} />
          </div>
          <p className="mt-1 text-[11px] font-semibold text-red-900/80 dark:text-red-200/80">
            Active hazard warnings
          </p>
        </div>

        <div className="rounded-3xl border border-sky-500/30 bg-sky-500/10 p-5 shadow-sm">
          <div className="flex items-center justify-between text-sky-800 dark:text-sky-200 text-xs font-bold">
            <span>Dispatched or Resolved</span>
            <span className="text-xl">✅</span>
          </div>
          <div className="mt-2 font-display text-3xl font-extrabold text-sky-600 dark:text-sky-400">
            <CountUp to={stats.resolved} />
          </div>
          <p className="mt-1 text-[11px] font-semibold text-sky-900/80 dark:text-sky-200/80">
            Actions taken by local teams
          </p>
        </div>
      </div>

      {/* Visual Charts (hidden if low bandwidth mode is on to preserve data) */}
      {!isLowBandwidth ? (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Chart 1: Incidents by Category */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-extrabold text-foreground flex items-center gap-2">
                <PieIcon className="size-4 text-primary" /> Reports by Category
              </h2>
              <span className="text-[11px] font-bold text-muted-foreground">Live Distribution</span>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    innerRadius={42}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              {categoryChartData.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground">{item.name}:</span>
                  <span className="text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 2: Top Monitored Areas */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-extrabold text-foreground flex items-center gap-2">
                <BarChart3 className="size-4 text-primary" /> Reports by Ilorin Neighborhood
              </h2>
              <span className="text-[11px] font-bold text-muted-foreground">
                Current Active Count
              </span>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={areaChartData}
                  margin={{ top: 10, right: 10, left: -25, bottom: 15 }}
                >
                  <XAxis
                    dataKey="area"
                    tick={{ fontSize: 11, fontWeight: 600 }}
                    angle={-20}
                    textAnchor="end"
                  />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  />
                  <Bar dataKey="count" fill="#0284c7" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-amber-500/40 bg-amber-500/5 p-4 text-center text-xs font-semibold text-amber-800 dark:text-amber-200">
          ⚡ <strong>Low-Bandwidth Mode Active:</strong> Charts and heavy visual elements are
          suppressed to conserve mobile data.
        </div>
      )}

      {/* Incident Verification Ledger Table */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-5">
        {/* Filter Controls Row */}
        <div className="space-y-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-extrabold text-foreground flex items-center gap-2">
                <FileCheck2 className="size-5 text-primary" /> Incident Verification Ledger
              </h2>
              <p className="text-xs font-semibold text-muted-foreground">
                Click any report row to view audit trail, verify claims, or view responder next
                steps.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search title, street, ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background pl-8 pr-3 py-1.5 text-xs font-semibold focus:ring-1 focus:ring-primary"
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  setSortBy((s) =>
                    s === "trust" ? "confirmations" : s === "confirmations" ? "date" : "trust",
                  )
                }
                className="inline-flex items-center gap-1 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-bold hover:bg-muted shrink-0"
              >
                <ArrowUpDown className="size-3" />
                Sort:{" "}
                {sortBy === "trust"
                  ? "Credibility Score"
                  : sortBy === "confirmations"
                    ? "Confirmations"
                    : "Recent"}
              </button>
            </div>
          </div>

          {/* Secondary Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="font-bold text-muted-foreground flex items-center gap-1">
              <Filter className="size-3" /> Filter by:
            </span>

            {/* Category Dropdown */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-xl border border-input bg-background px-2.5 py-1 text-xs font-bold"
            >
              <option value="all">All Categories</option>
              <option value="flooding">🌊 Flooding</option>
              <option value="infrastructure">🏗️ Infrastructure</option>
              <option value="sanitation">🗑️ Sanitation & Drains</option>
              <option value="utility">⚡ Utility Outages</option>
              <option value="safety">🛡️ Public Safety</option>
            </select>

            {/* Verification Status Dropdown */}
            <select
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
              className="rounded-xl border border-input bg-background px-2.5 py-1 text-xs font-bold"
            >
              <option value="all">All Verification Statuses</option>
              <option value="submitted">Submitted (Pending)</option>
              <option value="community_confirmed">Community Confirmed</option>
              <option value="field_verified">Field Verified</option>
              <option value="disputed">Disputed</option>
              <option value="unverified">Unverified</option>
            </select>

            {/* Severity Dropdown */}
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="rounded-xl border border-input bg-background px-2.5 py-1 text-xs font-bold"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="moderate">Moderate</option>
              <option value="low">Low</option>
            </select>

            {/* Lifecycle Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-input bg-background px-2.5 py-1 text-xs font-bold"
            >
              <option value="all">All Lifecycle States</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="dispatched">Dispatched</option>
              <option value="resolved">Resolved</option>
            </select>

            {(categoryFilter !== "all" ||
              severityFilter !== "all" ||
              verificationFilter !== "all" ||
              statusFilter !== "all" ||
              search) && (
              <button
                type="button"
                onClick={() => {
                  setCategoryFilter("all");
                  setSeverityFilter("all");
                  setVerificationFilter("all");
                  setStatusFilter("all");
                  setSearch("");
                }}
                className="text-[11px] font-bold text-destructive hover:underline ml-auto"
              >
                Clear Filters ({filteredReports.length} results)
              </button>
            )}
          </div>
        </div>

        {/* Master Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-semibold">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="pb-3 pt-2">ID & Category</th>
                <th className="pb-3 pt-2">Incident Title & Location</th>
                <th className="pb-3 pt-2">Severity</th>
                <th className="pb-3 pt-2">Verification & Trust</th>
                <th className="pb-3 pt-2">Lifecycle</th>
                <th className="pb-3 pt-2 text-center">Confirmations</th>
                <th className="pb-3 pt-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">
                    No incident reports match your active filter criteria.
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr
                    key={report.id}
                    onClick={() => setSelectedReportForDetail(report)}
                    className="hover:bg-muted/40 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 space-y-1">
                      <span className="font-mono font-bold text-muted-foreground block">
                        {report.id}
                      </span>
                      <CategoryPill category={report.category} />
                    </td>

                    <td className="py-3.5 max-w-xs sm:max-w-sm">
                      <span className="font-bold text-foreground block group-hover:text-primary transition-colors">
                        {report.title}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        📍 {report.street}, {report.location}
                      </span>
                    </td>

                    <td className="py-3.5">
                      <SeverityPill severity={report.severity} />
                    </td>

                    <td className="py-3.5 space-y-1">
                      <VerificationBadge status={report.verificationStatus} />
                      <div className="text-[10px] text-muted-foreground font-bold">
                        Trust Score:{" "}
                        <span className="text-foreground">{report.credibilityScore}%</span>
                      </div>
                    </td>

                    <td className="py-3.5">
                      <StatusBadge status={report.status} />
                    </td>

                    <td className="py-3.5 text-center">
                      {(() => {
                        const isConfirmed = hasUserConfirmed(report.id);
                        return (
                          <button
                            type="button"
                            disabled={isConfirmed}
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmReport(report.id);
                            }}
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-bold transition-all ${
                              isConfirmed
                                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 cursor-default"
                                : "bg-primary/10 text-primary hover:bg-primary/20"
                            }`}
                            title={
                              isConfirmed
                                ? "You have corroborated this report"
                                : "Affirm this observation as accurate"
                            }
                          >
                            {isConfirmed ? (
                              <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <ThumbsUp className="size-3" />
                            )}
                            <span>{report.confirmations}</span>
                          </button>
                        );
                      })()}
                    </td>

                    <td className="py-3.5 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedReportForDetail(report);
                        }}
                        className="inline-flex items-center gap-1 rounded-xl border border-border bg-background px-2.5 py-1.5 text-[11px] font-bold text-foreground hover:bg-accent"
                      >
                        Inspect <ExternalLink className="size-3" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
