"use client";

import { useState } from "react";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import { assessments } from "@/lib/mock-data";
import {
  ClipboardList,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  Download,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  Database,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
  Globe,
  Clock,
  User,
  Activity,
  FileSpreadsheet,
  ShieldCheck,
  Gauge,
} from "lucide-react";

// -- Assessment type configuration --
const typeConfig: Record<string, { color: string; bg: string; border: string; label: string }> = {
  rapid_damage: { color: "text-red-400", bg: "bg-red-500/15", border: "border-red-500/30", label: "Rapid Damage" },
  needs: { color: "text-blue-400", bg: "bg-blue-500/15", border: "border-blue-500/30", label: "Needs Assessment" },
  facility_status: { color: "text-amber-400", bg: "bg-amber-500/15", border: "border-amber-500/30", label: "Facility Status" },
  coping_capacity: { color: "text-emerald-400", bg: "bg-emerald-500/15", border: "border-emerald-500/30", label: "Coping Capacity" },
};

const statusBadgeMap: Record<string, "draft" | "deployed" | "collecting" | "completed"> = {
  draft: "draft",
  deployed: "deployed",
  collecting: "collecting",
  completed: "completed",
};

// -- Mock feedback loop data: model prediction vs observed --
interface FeedbackItem {
  id: string;
  metric: string;
  predicted: number;
  observed: number;
  unit: string;
  country: string;
  date: string;
}

const feedbackData: FeedbackItem[] = [
  { id: "fb-1", metric: "Affected Population (Sofala Cyclone)", predicted: 1_200_000, observed: 1_050_000, unit: "people", country: "Mozambique", date: "2026-02-09" },
  { id: "fb-2", metric: "Flood Extent (Lower Shire)", predicted: 342, observed: 378, unit: "km\u00B2", country: "Malawi", date: "2026-02-08" },
  { id: "fb-3", metric: "Health Facilities Damaged (Beira)", predicted: 67, observed: 58, unit: "facilities", country: "Mozambique", date: "2026-02-09" },
  { id: "fb-4", metric: "Displaced Households (Nsanje)", predicted: 12_500, observed: 14_200, unit: "households", country: "Malawi", date: "2026-02-07" },
  { id: "fb-5", metric: "IPC Phase 3+ Population (South Mdg)", predicted: 450_000, observed: 420_000, unit: "people", country: "Madagascar", date: "2026-02-05" },
];

// -- Mock data quality scores --
interface DataQualityScore {
  source: string;
  completeness: number;
  consistency: number;
  timeliness: number;
  overall: number;
}

const dataQualityScores: DataQualityScore[] = [
  { source: "IFRC Mozambique Field Reports", completeness: 94, consistency: 88, timeliness: 91, overall: 91 },
  { source: "Malawi Red Cross Assessment", completeness: 87, consistency: 92, timeliness: 78, overall: 86 },
  { source: "WHO Facility Status Survey", completeness: 72, consistency: 95, timeliness: 65, overall: 77 },
  { source: "UNDP Coping Capacity Survey", completeness: 98, consistency: 91, timeliness: 96, overall: 95 },
];

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export default function DataCollectionPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAssessments = assessments.filter((a) => {
    const matchesStatus =
      statusFilter === "all" || a.status === statusFilter;
    const matchesSearch =
      searchQuery === "" ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalResponses = assessments.reduce((s, a) => s + a.responses, 0);
  const totalTarget = assessments.reduce((s, a) => s + a.targetResponses, 0);
  const completedAssessments = assessments.filter(
    (a) => a.status === "completed"
  ).length;
  const activeAssessments = assessments.filter(
    (a) => a.status === "collecting" || a.status === "deployed"
  ).length;

  return (
        <div className="space-y-6">
          {/* Page Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-100">
                Data Collection & Feedback
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                KoboToolbox integration, assessment management, and model feedback loops
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="secondary" size="sm" icon={<RefreshCw className="h-4 w-4" />}>
                Sync Kobo
              </Button>
              <Button variant="primary" size="sm" icon={<Plus className="h-4 w-4" />}>
                Deploy New Form
              </Button>
            </div>
          </div>

          {/* KPI Row */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Card hover>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Total Responses
                  </p>
                  <p className="mt-1 text-2xl font-bold text-blue-400">
                    {totalResponses}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    of {totalTarget} target
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400">
                  <Database className="h-5 w-5" />
                </div>
              </div>
              <ProgressBar
                value={totalResponses}
                max={totalTarget}
                size="sm"
                className="mt-3"
              />
            </Card>

            <Card hover>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Active Assessments
                  </p>
                  <p className="mt-1 text-2xl font-bold text-amber-400">
                    {activeAssessments}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    currently collecting
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400">
                  <Activity className="h-5 w-5" />
                </div>
              </div>
            </Card>

            <Card hover>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Completed
                  </p>
                  <p className="mt-1 text-2xl font-bold text-emerald-400">
                    {completedAssessments}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    assessments finished
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </div>
            </Card>

            <Card hover>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Avg Data Quality
                  </p>
                  <p className="mt-1 text-2xl font-bold text-violet-400">
                    {Math.round(
                      dataQualityScores.reduce((s, d) => s + d.overall, 0) /
                        dataQualityScores.length
                    )}
                    %
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    across all sources
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/15 text-violet-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
              </div>
            </Card>
          </div>

          {/* Assessment Forms Section */}
          <Card padding="none" className="mb-6">
            <div className="border-b border-slate-700/50 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle icon={<ClipboardList className="h-4 w-4" />}>
                  Assessment Forms
                </CardTitle>
                <div className="flex items-center gap-2">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search assessments..."
                      className="rounded-lg border border-slate-700/50 bg-slate-900/60 py-1.5 pl-8 pr-3 text-xs text-slate-200 placeholder-slate-600 outline-none transition-colors focus:border-blue-500/50"
                    />
                  </div>
                  {/* Filters */}
                  <div className="flex items-center gap-1">
                    {["all", "draft", "deployed", "collecting", "completed"].map(
                      (f) => (
                        <button
                          key={f}
                          onClick={() => setStatusFilter(f)}
                          className={`rounded-lg px-2 py-1 text-xs font-medium transition-colors ${
                            statusFilter === f
                              ? "bg-blue-500/15 text-blue-400"
                              : "text-slate-500 hover:bg-slate-800 hover:text-slate-300"
                          }`}
                        >
                          {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="divide-y divide-slate-700/30">
              {filteredAssessments.map((assessment) => {
                const tConf = typeConfig[assessment.type];
                const percentage = Math.round(
                  (assessment.responses / assessment.targetResponses) * 100
                );
                const createdDate = new Date(
                  assessment.createdAt
                ).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });

                return (
                  <div
                    key={assessment.id}
                    className="flex flex-col gap-4 px-5 py-4 transition-colors hover:bg-slate-800/30 sm:flex-row sm:items-center"
                  >
                    {/* Left: Info */}
                    <div className="min-w-0 flex-1">
                      <div className="mb-1.5 flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-medium text-slate-200">
                          {assessment.title}
                        </h4>
                        <Badge
                          variant={statusBadgeMap[assessment.status]}
                          dot
                          pulse={assessment.status === "collecting"}
                        >
                          {assessment.status.charAt(0).toUpperCase() +
                            assessment.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 ${tConf.bg} ${tConf.border} ${tConf.color}`}
                        >
                          {tConf.label}
                        </span>
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {assessment.country}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {assessment.submittedBy}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {createdDate}
                        </span>
                      </div>
                    </div>

                    {/* Middle: Progress */}
                    <div className="w-full sm:w-48">
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="text-slate-400">
                          {assessment.responses} / {assessment.targetResponses}
                        </span>
                        <span
                          className={`font-medium ${
                            percentage >= 100
                              ? "text-emerald-400"
                              : percentage >= 50
                              ? "text-blue-400"
                              : "text-amber-400"
                          }`}
                        >
                          {percentage}%
                        </span>
                      </div>
                      <ProgressBar
                        value={assessment.responses}
                        max={assessment.targetResponses}
                        size="sm"
                      />
                    </div>

                    {/* Right: Actions */}
                    <div className="flex shrink-0 items-center gap-2">
                      <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700/50 text-slate-500 transition-colors hover:border-slate-600 hover:bg-slate-800 hover:text-slate-300">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700/50 text-slate-500 transition-colors hover:border-slate-600 hover:bg-slate-800 hover:text-slate-300">
                        <Download className="h-3.5 w-3.5" />
                      </button>
                      <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700/50 text-slate-500 transition-colors hover:border-blue-500/30 hover:bg-blue-500/5 hover:text-blue-400">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Bottom row: Feedback Loop + Data Quality */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {/* Feedback Loop Section */}
            <Card padding="none">
              <div className="border-b border-slate-700/50 p-5">
                <div className="flex items-center justify-between">
                  <CardTitle icon={<BarChart3 className="h-4 w-4" />}>
                    Feedback Loop: Model vs Observed
                  </CardTitle>
                  <Badge variant="info" dot>
                    {feedbackData.length} comparisons
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Comparing SIRS model predictions against field-observed data
                </p>
              </div>

              <div className="divide-y divide-slate-700/30">
                {feedbackData.map((item) => {
                  const diff = item.observed - item.predicted;
                  const diffPct =
                    item.predicted !== 0
                      ? Math.round((diff / item.predicted) * 100)
                      : 0;
                  const isOver = diff > 0;
                  const isClose = Math.abs(diffPct) <= 10;

                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 px-5 py-3.5"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-slate-200 truncate">
                          {item.metric}
                        </p>
                        <div className="mt-0.5 flex items-center gap-2 text-[10px] text-slate-500">
                          <span>{item.country}</span>
                          <span>{item.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <div className="text-right">
                          <span className="text-slate-500">Predicted</span>
                          <p className="font-medium text-slate-300">
                            {formatNumber(item.predicted)} {item.unit}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-500">Observed</span>
                          <p className="font-medium text-slate-200">
                            {formatNumber(item.observed)} {item.unit}
                          </p>
                        </div>
                        <div
                          className={`flex items-center gap-1 rounded-lg px-2 py-1 ${
                            isClose
                              ? "bg-emerald-500/10 text-emerald-400"
                              : isOver
                              ? "bg-red-500/10 text-red-400"
                              : "bg-blue-500/10 text-blue-400"
                          }`}
                        >
                          {isClose ? (
                            <Minus className="h-3 w-3" />
                          ) : isOver ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          <span className="font-medium">
                            {diffPct > 0 ? "+" : ""}
                            {diffPct}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Data Quality Indicators */}
            <Card padding="none">
              <div className="border-b border-slate-700/50 p-5">
                <div className="flex items-center justify-between">
                  <CardTitle icon={<Gauge className="h-4 w-4" />}>
                    Data Quality Indicators
                  </CardTitle>
                  <Button variant="ghost" size="sm" icon={<FileSpreadsheet className="h-3.5 w-3.5" />}>
                    Export Report
                  </Button>
                </div>
              </div>

              <div className="divide-y divide-slate-700/30">
                {dataQualityScores.map((source) => (
                  <div key={source.source} className="px-5 py-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="text-xs font-medium text-slate-200">
                        {source.source}
                      </h4>
                      <span
                        className={`text-xs font-bold ${
                          source.overall >= 90
                            ? "text-emerald-400"
                            : source.overall >= 75
                            ? "text-blue-400"
                            : source.overall >= 60
                            ? "text-amber-400"
                            : "text-red-400"
                        }`}
                      >
                        {source.overall}%
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-[10px] text-slate-500">
                            Completeness
                          </span>
                          <span className="text-[10px] font-medium text-slate-400">
                            {source.completeness}%
                          </span>
                        </div>
                        <ProgressBar
                          value={source.completeness}
                          max={100}
                          size="sm"
                          variant={
                            source.completeness >= 90
                              ? "success"
                              : source.completeness >= 70
                              ? "info"
                              : "warning"
                          }
                        />
                      </div>
                      <div>
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-[10px] text-slate-500">
                            Consistency
                          </span>
                          <span className="text-[10px] font-medium text-slate-400">
                            {source.consistency}%
                          </span>
                        </div>
                        <ProgressBar
                          value={source.consistency}
                          max={100}
                          size="sm"
                          variant={
                            source.consistency >= 90
                              ? "success"
                              : source.consistency >= 70
                              ? "info"
                              : "warning"
                          }
                        />
                      </div>
                      <div>
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-[10px] text-slate-500">
                            Timeliness
                          </span>
                          <span className="text-[10px] font-medium text-slate-400">
                            {source.timeliness}%
                          </span>
                        </div>
                        <ProgressBar
                          value={source.timeliness}
                          max={100}
                          size="sm"
                          variant={
                            source.timeliness >= 90
                              ? "success"
                              : source.timeliness >= 70
                              ? "info"
                              : "warning"
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
  );
}
