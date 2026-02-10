"use client";

import { useState, useMemo } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import { sadcCountries } from "@/lib/mock-data";
import type { CountryRisk, DistrictRisk } from "@/lib/mock-data";
import { formatNumber, getRiskLevel, getRiskColor, getRiskBadgeClass } from "@/lib/utils";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  ShieldAlert,
  Download,
  ChevronDown,
  ChevronRight,
  MapPin,
  Users,
  Building2,
  Droplets,
  GraduationCap,
  Heart,
  Clock,
  Globe,
  AlertTriangle,
  TrendingUp,
  Filter,
  Search,
} from "lucide-react";

// -- Time horizons for selector --
const timeHorizons = [
  { label: "1-Day", value: "1d" },
  { label: "3-Day", value: "3d" },
  { label: "7-Day", value: "7d" },
  { label: "14-Day", value: "14d" },
];

// -- Risk matrix cell data --
const probabilityLabels = ["Very Low", "Low", "Medium", "High", "Very High"];
const impactLabels = ["Minimal", "Minor", "Moderate", "Severe", "Critical"];

function getRiskMatrixColor(prob: number, impact: number): string {
  const score = (prob + impact) / 2;
  if (score >= 4) return "bg-red-500/60 border-red-500/40";
  if (score >= 3) return "bg-orange-500/40 border-orange-500/30";
  if (score >= 2) return "bg-yellow-500/30 border-yellow-500/20";
  return "bg-green-500/20 border-green-500/15";
}

function getCountryMatrixPosition(country: CountryRisk): { prob: number; impact: number } {
  // Map scores to 0-4 grid. hazardScore -> probability, vulnerabilityScore -> impact
  const prob = Math.min(4, Math.floor(country.hazardScore * 5));
  const impact = Math.min(4, Math.floor(country.vulnerabilityScore * 5));
  return { prob, impact };
}

export default function RiskMonitorPage() {
  const [selectedCountry, setSelectedCountry] = useState<string>("moz");
  const [expandedCountry, setExpandedCountry] = useState<string | null>("moz");
  const [timeHorizon, setTimeHorizon] = useState<string>("3d");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"risk" | "name" | "affected">("risk");

  const country = sadcCountries.find((c) => c.id === selectedCountry);

  // Build radar chart data for selected country
  const radarData = useMemo(() => {
    if (!country) return [];
    return [
      { dimension: "Hazard", value: country.hazardScore, fullMark: 1 },
      { dimension: "Exposure", value: country.exposureScore, fullMark: 1 },
      { dimension: "Vulnerability", value: country.vulnerabilityScore, fullMark: 1 },
      { dimension: "Coping\nCapacity", value: 1 - country.copingCapacity, fullMark: 1 },
    ];
  }, [country]);

  // Build matrix cell map: which countries are in which cell
  const matrixCells = useMemo(() => {
    const cells: Record<string, CountryRisk[]> = {};
    sadcCountries.forEach((c) => {
      const { prob, impact } = getCountryMatrixPosition(c);
      const key = `${prob}-${impact}`;
      if (!cells[key]) cells[key] = [];
      cells[key].push(c);
    });
    return cells;
  }, []);

  // Filter and sort countries
  const filteredCountries = useMemo(() => {
    let list = [...sadcCountries];
    if (searchQuery) {
      list = list.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    list.sort((a, b) => {
      if (sortBy === "risk") return b.riskScore - a.riskScore;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return b.affectedPopulation - a.affectedPopulation;
    });
    return list;
  }, [searchQuery, sortBy]);

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />

      <main className="flex-1 lg:pl-64">
        <div className="p-6 lg:p-8">
          {/* Page Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-100">
                Risk Monitor
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Detailed risk matrix, country profiles, and risk decomposition
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Time Horizon Selector */}
              <div className="flex items-center rounded-lg border border-slate-700/50 bg-slate-900/60">
                {timeHorizons.map((h) => (
                  <button
                    key={h.value}
                    onClick={() => setTimeHorizon(h.value)}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                      timeHorizon === h.value
                        ? "bg-blue-500/15 text-blue-400"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {h.label}
                  </button>
                ))}
              </div>
              <Button
                variant="secondary"
                size="sm"
                icon={<Download className="h-4 w-4" />}
              >
                Export View
              </Button>
            </div>
          </div>

          {/* Top Section: Risk Matrix + Radar Decomposition */}
          <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
            {/* Risk Matrix - 2 cols wide */}
            <Card padding="md" className="xl:col-span-2">
              <CardHeader>
                <CardTitle icon={<ShieldAlert className="h-4 w-4" />}>
                  Risk Matrix (Probability vs Impact)
                </CardTitle>
                <Badge variant="info">
                  <Clock className="mr-1 inline h-3 w-3" />
                  {timeHorizons.find((h) => h.value === timeHorizon)?.label} Horizon
                </Badge>
              </CardHeader>

              <div className="overflow-x-auto">
                <div className="min-w-[520px]">
                  {/* Matrix grid */}
                  <div className="flex">
                    {/* Y-axis label */}
                    <div className="flex w-20 shrink-0 flex-col items-center justify-center">
                      <span className="rotate-[-90deg] whitespace-nowrap text-xs font-medium text-slate-400">
                        Probability
                      </span>
                    </div>

                    <div className="flex-1">
                      {/* Grid rows (top = highest probability) */}
                      {[...Array(5)].map((_, rowIdx) => {
                        const probIdx = 4 - rowIdx; // Flip so high is at top
                        return (
                          <div key={probIdx} className="flex">
                            {/* Row label */}
                            <div className="flex w-16 shrink-0 items-center justify-end pr-2">
                              <span className="text-[10px] text-slate-500">
                                {probabilityLabels[probIdx]}
                              </span>
                            </div>
                            {/* Cells */}
                            {[...Array(5)].map((_, colIdx) => {
                              const cellKey = `${probIdx}-${colIdx}`;
                              const countriesInCell = matrixCells[cellKey] || [];
                              return (
                                <div
                                  key={colIdx}
                                  className={`flex min-h-[64px] flex-1 flex-wrap items-center justify-center gap-1 border p-1.5 ${getRiskMatrixColor(
                                    probIdx,
                                    colIdx
                                  )}`}
                                >
                                  {countriesInCell.map((c) => (
                                    <button
                                      key={c.id}
                                      onClick={() => {
                                        setSelectedCountry(c.id);
                                        setExpandedCountry(c.id);
                                      }}
                                      className={`group relative flex h-7 w-7 items-center justify-center rounded-full text-[9px] font-bold transition-all ${
                                        c.id === selectedCountry
                                          ? "bg-blue-500 text-white ring-2 ring-blue-400/50 scale-110"
                                          : "bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:scale-105"
                                      }`}
                                      title={c.name}
                                    >
                                      {c.code}
                                      {/* Tooltip on hover */}
                                      <div className="pointer-events-none absolute -top-8 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-[10px] text-slate-200 opacity-0 shadow-lg ring-1 ring-slate-700/50 transition-opacity group-hover:opacity-100">
                                        {c.name}: {(c.riskScore * 10).toFixed(1)}
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                      {/* X-axis labels */}
                      <div className="flex">
                        <div className="w-16 shrink-0" />
                        {impactLabels.map((label) => (
                          <div
                            key={label}
                            className="flex flex-1 items-center justify-center pt-2"
                          >
                            <span className="text-[10px] text-slate-500">
                              {label}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-1 text-center">
                        <span className="text-xs font-medium text-slate-400">
                          Impact
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Radar Chart - Risk Decomposition */}
            <Card padding="md">
              <CardHeader>
                <CardTitle icon={<AlertTriangle className="h-4 w-4" />}>
                  Risk Decomposition
                </CardTitle>
              </CardHeader>

              {country && (
                <>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-slate-500" />
                      <span className="text-sm font-semibold text-slate-100">
                        {country.name}
                      </span>
                    </div>
                    <Badge
                      className={getRiskBadgeClass(country.riskScore)}
                    >
                      {getRiskLevel(country.riskScore)} ({(country.riskScore * 10).toFixed(1)})
                    </Badge>
                  </div>

                  <div className="h-[260px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                        <PolarGrid
                          stroke="#334155"
                          strokeDasharray="3 3"
                        />
                        <PolarAngleAxis
                          dataKey="dimension"
                          tick={{ fill: "#94a3b8", fontSize: 11 }}
                        />
                        <PolarRadiusAxis
                          angle={90}
                          domain={[0, 1]}
                          tick={{ fill: "#64748b", fontSize: 10 }}
                          tickCount={5}
                        />
                        <Radar
                          name={country.name}
                          dataKey="value"
                          stroke={getRiskColor(country.riskScore)}
                          fill={getRiskColor(country.riskScore)}
                          fillOpacity={0.25}
                          strokeWidth={2}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "#1e293b",
                            border: "1px solid rgba(100, 116, 139, 0.3)",
                            borderRadius: "0.5rem",
                            color: "#e2e8f0",
                            fontSize: "12px",
                          }}
                          formatter={(value?: number) => [
                            ((value ?? 0) * 10).toFixed(1),
                            "Score",
                          ]}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Dimension breakdown */}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {[
                      { label: "Hazard", score: country.hazardScore, color: "text-red-400" },
                      { label: "Exposure", score: country.exposureScore, color: "text-orange-400" },
                      { label: "Vulnerability", score: country.vulnerabilityScore, color: "text-amber-400" },
                      { label: "Coping Cap.", score: country.copingCapacity, color: "text-emerald-400" },
                    ].map((dim) => (
                      <div
                        key={dim.label}
                        className="rounded-lg border border-slate-700/50 bg-slate-900/50 px-3 py-2"
                      >
                        <p className="text-[10px] text-slate-500">{dim.label}</p>
                        <p className={`text-sm font-bold ${dim.color}`}>
                          {(dim.score * 10).toFixed(1)}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </Card>
          </div>

          {/* Country Risk Profiles */}
          <Card padding="none">
            <div className="border-b border-slate-700/50 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle icon={<Globe className="h-4 w-4" />}>
                  Country Risk Profiles
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search countries..."
                      className="rounded-lg border border-slate-700/50 bg-slate-900/60 py-1.5 pl-8 pr-3 text-xs text-slate-200 placeholder-slate-600 outline-none transition-colors focus:border-blue-500/50"
                    />
                  </div>
                  <div className="flex items-center gap-1 rounded-lg border border-slate-700/50 bg-slate-900/60">
                    {(
                      [
                        { key: "risk", label: "Risk" },
                        { key: "name", label: "Name" },
                        { key: "affected", label: "Affected" },
                      ] as const
                    ).map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => setSortBy(opt.key)}
                        className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                          sortBy === opt.key
                            ? "bg-blue-500/15 text-blue-400"
                            : "text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="divide-y divide-slate-700/30">
              {filteredCountries.map((c) => {
                const isExpanded = expandedCountry === c.id;
                const hasDistricts = c.districts.length > 0;

                return (
                  <div key={c.id}>
                    {/* Country Row */}
                    <button
                      onClick={() => {
                        setSelectedCountry(c.id);
                        if (hasDistricts) {
                          setExpandedCountry(isExpanded ? null : c.id);
                        }
                      }}
                      className={`flex w-full items-center gap-4 px-5 py-4 text-left transition-colors ${
                        c.id === selectedCountry
                          ? "bg-blue-500/5"
                          : "hover:bg-slate-800/30"
                      }`}
                    >
                      {/* Expand icon */}
                      <div className="w-5 shrink-0">
                        {hasDistricts ? (
                          isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-slate-400" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-slate-500" />
                          )
                        ) : (
                          <div className="h-4 w-4" />
                        )}
                      </div>

                      {/* Country flag / code */}
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                        style={{
                          backgroundColor: getRiskColor(c.riskScore) + "20",
                          color: getRiskColor(c.riskScore),
                        }}
                      >
                        {c.code}
                      </div>

                      {/* Country info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium text-slate-200">
                            {c.name}
                          </h4>
                          <Badge className={getRiskBadgeClass(c.riskScore)}>
                            {getRiskLevel(c.riskScore)}
                          </Badge>
                          {c.activeAlerts > 0 && (
                            <Badge variant="critical" dot pulse>
                              {c.activeAlerts} alert{c.activeAlerts > 1 ? "s" : ""}
                            </Badge>
                          )}
                        </div>
                        <div className="mt-0.5 flex items-center gap-3 text-xs text-slate-500">
                          <span>Pop: {formatNumber(c.population)}</span>
                          <span>Affected: {formatNumber(c.affectedPopulation)}</span>
                          {hasDistricts && (
                            <span>{c.districts.length} districts</span>
                          )}
                        </div>
                      </div>

                      {/* Risk score bar */}
                      <div className="hidden w-32 shrink-0 sm:block">
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span className="text-slate-500">Risk</span>
                          <span
                            className="font-bold"
                            style={{ color: getRiskColor(c.riskScore) }}
                          >
                            {(c.riskScore * 10).toFixed(1)}
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700/50">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${c.riskScore * 100}%`,
                              backgroundColor: getRiskColor(c.riskScore),
                            }}
                          />
                        </div>
                      </div>

                      {/* Score pillars mini display */}
                      <div className="hidden shrink-0 items-center gap-2 lg:flex">
                        {[
                          { label: "H", value: c.hazardScore },
                          { label: "E", value: c.exposureScore },
                          { label: "V", value: c.vulnerabilityScore },
                          { label: "C", value: c.copingCapacity },
                        ].map((p) => (
                          <div
                            key={p.label}
                            className="flex flex-col items-center"
                            title={
                              p.label === "H"
                                ? "Hazard"
                                : p.label === "E"
                                ? "Exposure"
                                : p.label === "V"
                                ? "Vulnerability"
                                : "Coping Capacity"
                            }
                          >
                            <span className="text-[9px] text-slate-600">
                              {p.label}
                            </span>
                            <span
                              className="text-xs font-medium"
                              style={{
                                color:
                                  p.label === "C"
                                    ? getRiskColor(1 - p.value)
                                    : getRiskColor(p.value),
                              }}
                            >
                              {(p.value * 10).toFixed(1)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </button>

                    {/* District Drill-Down */}
                    {isExpanded && hasDistricts && (
                      <div className="border-t border-slate-700/20 bg-slate-900/30">
                        <div className="px-5 py-2">
                          <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                            District-Level Breakdown
                          </span>
                        </div>
                        {c.districts.map((dist) => (
                          <div
                            key={dist.id}
                            className="flex items-center gap-4 border-t border-slate-800/50 px-5 py-3 pl-14"
                          >
                            <MapPin
                              className="h-3.5 w-3.5 shrink-0"
                              style={{ color: getRiskColor(dist.riskScore) }}
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-slate-300">
                                  {dist.name}
                                </span>
                                <Badge className={getRiskBadgeClass(dist.riskScore)}>
                                  {getRiskLevel(dist.riskScore)} ({(dist.riskScore * 10).toFixed(1)})
                                </Badge>
                              </div>
                              <div className="mt-0.5 flex items-center gap-3 text-[10px] text-slate-500">
                                <span className="flex items-center gap-0.5">
                                  <Users className="h-2.5 w-2.5" />
                                  {formatNumber(dist.affectedPopulation)} affected
                                </span>
                                <span className="flex items-center gap-0.5">
                                  <Heart className="h-2.5 w-2.5" />
                                  {dist.facilities.healthAtRisk}/{dist.facilities.health} health
                                </span>
                                <span className="flex items-center gap-0.5">
                                  <Droplets className="h-2.5 w-2.5" />
                                  {dist.facilities.washAtRisk}/{dist.facilities.wash} WASH
                                </span>
                                <span className="flex items-center gap-0.5">
                                  <GraduationCap className="h-2.5 w-2.5" />
                                  {dist.facilities.schoolsAtRisk}/{dist.facilities.schools} schools
                                </span>
                              </div>
                            </div>
                            {/* District mini risk bar */}
                            <div className="hidden w-24 shrink-0 sm:block">
                              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-700/50">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${dist.riskScore * 100}%`,
                                    backgroundColor: getRiskColor(dist.riskScore),
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
