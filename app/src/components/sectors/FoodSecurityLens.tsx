"use client";

import { sadcCountries } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";
import {
  Wheat,
  TrendingUp,
  AlertTriangle,
  Home,
  ShoppingCart,
  BarChart3,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

// IPC Phase classifications
const ipcPhases = [
  {
    phase: 1,
    label: "Minimal",
    color: "#c6e5b3",
    textColor: "#2d5016",
    population: 4_280_000,
    description: "Households able to meet minimum food needs",
  },
  {
    phase: 2,
    label: "Stressed",
    color: "#f9e84e",
    textColor: "#6b5c0a",
    population: 2_150_000,
    description: "Households have minimally adequate food consumption but unable to afford some essential non-food expenditures",
  },
  {
    phase: 3,
    label: "Crisis",
    color: "#e67800",
    textColor: "#ffffff",
    population: 1_340_000,
    description: "Households with significant food consumption gaps or marginally able to meet minimum food needs",
  },
  {
    phase: 4,
    label: "Emergency",
    color: "#c80000",
    textColor: "#ffffff",
    population: 520_000,
    description: "Households with large food consumption gaps resulting in very high acute malnutrition",
  },
  {
    phase: 5,
    label: "Famine",
    color: "#640000",
    textColor: "#ffffff",
    population: 45_000,
    description: "Extreme lack of food and/or other basic needs - starvation, death, and destitution evident",
  },
];

// Crop loss by district - derived from mock data
function buildCropLossData() {
  const allDistricts = sadcCountries.flatMap((c) => c.districts);
  return allDistricts
    .map((d) => ({
      district: d.name,
      country: d.country,
      cropLoss: Math.round(d.riskScore * 45 + Math.random() * 10),
      livestockLoss: Math.round(d.riskScore * 30 + Math.random() * 8),
      affectedHouseholds: Math.round(d.affectedPopulation / 5.2),
    }))
    .sort((a, b) => b.cropLoss - a.cropLoss);
}

// Food insecurity progression
const progressionData = [
  { month: "Oct 2025", phase1: 5200, phase2: 1800, phase3: 890, phase4: 280, phase5: 12 },
  { month: "Nov 2025", phase1: 4900, phase2: 1950, phase3: 1020, phase4: 340, phase5: 18 },
  { month: "Dec 2025", phase1: 4700, phase2: 2000, phase3: 1100, phase4: 380, phase5: 22 },
  { month: "Jan 2026", phase1: 4500, phase2: 2080, phase3: 1200, phase4: 430, phase5: 30 },
  { month: "Feb 2026", phase1: 4280, phase2: 2150, phase3: 1340, phase4: 520, phase5: 45 },
  { month: "Mar 2026*", phase1: 4100, phase2: 2250, phase3: 1500, phase4: 620, phase5: 65 },
];

// Market disruption indicators
const marketIndicators = [
  { market: "Beira Central", status: "Disrupted", priceChange: "+42%", supply: "Severely limited" },
  { market: "Nsanje Cross-border", status: "Disrupted", priceChange: "+38%", supply: "Limited" },
  { market: "Chikwawa District", status: "Restricted", priceChange: "+27%", supply: "Below average" },
  { market: "Analanjirofo Regional", status: "Restricted", priceChange: "+22%", supply: "Below average" },
  { market: "Zomba District", status: "Functional", priceChange: "+12%", supply: "Adequate" },
  { market: "Dar es Salaam Metro", status: "Functional", priceChange: "+8%", supply: "Adequate" },
];

function getMarketStatusColor(status: string) {
  switch (status) {
    case "Disrupted":
      return "text-red-400";
    case "Restricted":
      return "text-amber-400";
    case "Functional":
      return "text-emerald-400";
    default:
      return "text-zinc-400";
  }
}

export default function FoodSecurityLens() {
  const cropLossData = buildCropLossData();
  const totalAffectedHouseholds = cropLossData.reduce(
    (s, d) => s + d.affectedHouseholds,
    0
  );
  const totalPhase3Plus =
    ipcPhases[2].population + ipcPhases[3].population + ipcPhases[4].population;

  return (
    <div className="space-y-6">
      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<AlertTriangle className="h-5 w-5 text-amber-400" />}
          label="IPC Phase 3+"
          value={totalPhase3Plus}
          sub="Population in Crisis or worse"
        />
        <MetricCard
          icon={<Home className="h-5 w-5 text-amber-400" />}
          label="Farming Households"
          value={totalAffectedHouseholds}
          sub="Affected by crop/livestock loss"
        />
        <MetricCard
          icon={<ShoppingCart className="h-5 w-5 text-amber-400" />}
          label="Markets Disrupted"
          value={marketIndicators.filter((m) => m.status === "Disrupted").length}
          sub={`of ${marketIndicators.length} monitored markets`}
        />
        <MetricCard
          icon={<TrendingUp className="h-5 w-5 text-amber-400" />}
          label="Avg Price Increase"
          value={25}
          sub="Percent across monitored markets"
          suffix="%"
        />
      </div>

      {/* IPC Phase Classification */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
        <div className="flex items-center gap-3 mb-4">
          <Wheat className="h-5 w-5 text-amber-400" />
          <h3 className="text-sm font-semibold text-amber-300 uppercase tracking-wider">
            IPC Phase Classification - Current Estimate
          </h3>
        </div>
        <div className="space-y-3">
          {ipcPhases.map((phase) => {
            const totalPop = ipcPhases.reduce((s, p) => s + p.population, 0);
            const pct = (phase.population / totalPop) * 100;
            return (
              <div key={phase.phase} className="flex items-center gap-4">
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-md text-xs font-bold flex-shrink-0"
                  style={{
                    backgroundColor: phase.color,
                    color: phase.textColor,
                  }}
                >
                  {phase.phase}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-zinc-200 font-medium">
                      Phase {phase.phase}: {phase.label}
                    </span>
                    <span className="text-sm text-zinc-400">
                      {formatNumber(phase.population)} ({pct.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: phase.color,
                      }}
                    />
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">
                    {phase.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Food Insecurity Progression */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
          <h3 className="text-sm font-semibold text-zinc-300 mb-1">
            Food Insecurity Risk Progression
          </h3>
          <p className="text-xs text-zinc-500 mb-4">
            Population (thousands) by IPC Phase. * = projected.
          </p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progressionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#a1a1aa", fontSize: 10 }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={50}
                />
                <YAxis tick={{ fill: "#a1a1aa", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid #3f3f46",
                    borderRadius: "8px",
                    color: "#e4e4e7",
                  }}
                  formatter={(value?: number, name?: string) => [
                    `${value ?? 0}K`,
                    name ?? "",
                  ]}
                />
                <Legend wrapperStyle={{ fontSize: "11px", color: "#a1a1aa" }} />
                <Bar
                  dataKey="phase5"
                  name="Phase 5"
                  stackId="stack"
                  fill="#640000"
                />
                <Bar
                  dataKey="phase4"
                  name="Phase 4"
                  stackId="stack"
                  fill="#c80000"
                />
                <Bar
                  dataKey="phase3"
                  name="Phase 3"
                  stackId="stack"
                  fill="#e67800"
                />
                <Bar
                  dataKey="phase2"
                  name="Phase 2"
                  stackId="stack"
                  fill="#f9e84e"
                />
                <Bar
                  dataKey="phase1"
                  name="Phase 1"
                  stackId="stack"
                  fill="#c6e5b3"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Crop Loss by District */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
          <h3 className="text-sm font-semibold text-zinc-300 mb-1">
            Estimated Crop Loss by District
          </h3>
          <p className="text-xs text-zinc-500 mb-4">
            Percent of seasonal harvest at risk
          </p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cropLossData} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#27272a"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  tick={{ fill: "#a1a1aa", fontSize: 11 }}
                  unit="%"
                  domain={[0, 60]}
                />
                <YAxis
                  type="category"
                  dataKey="district"
                  tick={{ fill: "#a1a1aa", fontSize: 11 }}
                  width={120}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid #3f3f46",
                    borderRadius: "8px",
                    color: "#e4e4e7",
                  }}
                  formatter={(value?: number) => [`${value ?? 0}%`]}
                />
                <Bar dataKey="cropLoss" name="Crop Loss %" radius={[0, 4, 4, 0]}>
                  {cropLossData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={
                        entry.cropLoss > 40
                          ? "#ef4444"
                          : entry.cropLoss > 25
                          ? "#f59e0b"
                          : "#10b981"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Market Disruption Table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
        <div className="flex items-center gap-3 mb-4">
          <ShoppingCart className="h-5 w-5 text-amber-400" />
          <h3 className="text-sm font-semibold text-zinc-300">
            Market Disruption Indicators
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-3 px-3 text-zinc-400 font-medium">
                  Market
                </th>
                <th className="text-left py-3 px-3 text-zinc-400 font-medium">
                  Status
                </th>
                <th className="text-left py-3 px-3 text-zinc-400 font-medium">
                  Price Change
                </th>
                <th className="text-left py-3 px-3 text-zinc-400 font-medium">
                  Supply Level
                </th>
              </tr>
            </thead>
            <tbody>
              {marketIndicators.map((m, i) => (
                <tr
                  key={i}
                  className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="py-2.5 px-3 text-zinc-200">{m.market}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`font-medium ${getMarketStatusColor(
                        m.status
                      )}`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-red-400 font-medium">
                    {m.priceChange}
                  </td>
                  <td className="py-2.5 px-3 text-zinc-400">{m.supply}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Crop loss detail table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="h-5 w-5 text-amber-400" />
          <h3 className="text-sm font-semibold text-zinc-300">
            Crop &amp; Livestock Loss by District
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-3 px-3 text-zinc-400 font-medium">
                  District
                </th>
                <th className="text-left py-3 px-3 text-zinc-400 font-medium">
                  Country
                </th>
                <th className="text-right py-3 px-3 text-zinc-400 font-medium">
                  Crop Loss %
                </th>
                <th className="text-right py-3 px-3 text-zinc-400 font-medium">
                  Livestock Loss %
                </th>
                <th className="text-right py-3 px-3 text-zinc-400 font-medium">
                  Affected Households
                </th>
              </tr>
            </thead>
            <tbody>
              {cropLossData.map((d, i) => (
                <tr
                  key={i}
                  className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="py-2.5 px-3 text-zinc-200">{d.district}</td>
                  <td className="py-2.5 px-3 text-zinc-400">{d.country}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span
                      className={
                        d.cropLoss > 40
                          ? "text-red-400 font-medium"
                          : d.cropLoss > 25
                          ? "text-amber-400"
                          : "text-emerald-400"
                      }
                    >
                      {d.cropLoss}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span
                      className={
                        d.livestockLoss > 30
                          ? "text-red-400 font-medium"
                          : d.livestockLoss > 18
                          ? "text-amber-400"
                          : "text-emerald-400"
                      }
                    >
                      {d.livestockLoss}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right text-zinc-300">
                    {formatNumber(d.affectedHouseholds)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  sub,
  suffix,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  sub: string;
  suffix?: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div className="text-2xl font-bold text-zinc-100">
        {formatNumber(value)}
        {suffix || ""}
      </div>
      <div className="text-xs text-zinc-500 mt-1">{sub}</div>
    </div>
  );
}
