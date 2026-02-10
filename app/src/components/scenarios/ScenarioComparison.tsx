"use client";

import { useState, useMemo } from "react";
import { Scenario, scenarios as allScenarios, sadcCountries } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";
import {
  GitCompareArrows,
  X,
  Users,
  Building2,
  Globe,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  CloudLightning,
  Droplets,
  Sun,
  Minus,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ---- Types ----

const typeIcons: Record<Scenario["type"], typeof CloudLightning> = {
  cyclone: CloudLightning,
  flood: Droplets,
  drought: Sun,
};

const typeColors: Record<Scenario["type"], string> = {
  cyclone: "text-violet-400",
  flood: "text-blue-400",
  drought: "text-amber-400",
};

// ---- Mock detailed results for comparison ----

function generateMockDistrictImpact(scenario: Scenario) {
  // Use deterministic-ish data based on scenario ID for reproducibility
  const seed = scenario.id.charCodeAt(scenario.id.length - 1);
  const countries = scenario.affectedCountries;
  const districts: {
    name: string;
    country: string;
    affectedPopulation: number;
    healthFacilities: number;
    washFacilities: number;
    schools: number;
  }[] = [];

  countries.forEach((countryName) => {
    const country = sadcCountries.find((c) => c.name === countryName);
    if (country && country.districts.length > 0) {
      country.districts.forEach((d, i) => {
        const factor = (seed + i * 17) % 100 / 100;
        districts.push({
          name: d.name,
          country: countryName,
          affectedPopulation: Math.round(d.population * factor * 0.3),
          healthFacilities: Math.round(d.facilities.health * factor * 0.4),
          washFacilities: Math.round(d.facilities.wash * factor * 0.35),
          schools: Math.round(d.facilities.schools * factor * 0.3),
        });
      });
    } else {
      // Generate a placeholder district for countries without district data
      districts.push({
        name: `${countryName} (National)`,
        country: countryName,
        affectedPopulation: Math.round(
          (scenario.estimatedAffected / countries.length) * ((seed % 50 + 50) / 100)
        ),
        healthFacilities: Math.round(10 + (seed % 30)),
        washFacilities: Math.round(20 + (seed % 50)),
        schools: Math.round(15 + (seed % 40)),
      });
    }
  });

  return districts;
}

// ---- Component ----

interface ScenarioComparisonProps {
  scenarioA: Scenario;
  scenarioB: Scenario;
  onClose: () => void;
}

export default function ScenarioComparison({
  scenarioA,
  scenarioB,
  onClose,
}: ScenarioComparisonProps) {
  const districtDataA = useMemo(() => generateMockDistrictImpact(scenarioA), [scenarioA]);
  const districtDataB = useMemo(() => generateMockDistrictImpact(scenarioB), [scenarioB]);

  // Chart data: merge districts for comparison
  const chartData = useMemo(() => {
    const allNames = new Set([
      ...districtDataA.map((d) => d.name),
      ...districtDataB.map((d) => d.name),
    ]);
    return Array.from(allNames)
      .map((name) => {
        const a = districtDataA.find((d) => d.name === name);
        const b = districtDataB.find((d) => d.name === name);
        return {
          district: name,
          scenarioA: a?.affectedPopulation ?? 0,
          scenarioB: b?.affectedPopulation ?? 0,
        };
      })
      .sort((x, y) => (y.scenarioA + y.scenarioB) - (x.scenarioA + x.scenarioB))
      .slice(0, 8);
  }, [districtDataA, districtDataB]);

  // Deltas
  const popDelta = scenarioA.estimatedAffected - scenarioB.estimatedAffected;
  const facDelta = scenarioA.estimatedFacilitiesAtRisk - scenarioB.estimatedFacilitiesAtRisk;
  const countryDelta = scenarioA.affectedCountries.length - scenarioB.affectedCountries.length;

  function DeltaBadge({ value, unit = "" }: { value: number; unit?: string }) {
    if (value === 0) return <span className="text-xs text-slate-500 flex items-center gap-0.5"><Minus className="h-3 w-3" /> No change</span>;
    const isUp = value > 0;
    return (
      <span
        className={`inline-flex items-center gap-0.5 text-xs font-medium ${
          isUp ? "text-red-400" : "text-emerald-400"
        }`}
      >
        {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        {isUp ? "+" : ""}
        {formatNumber(value)}
        {unit}
      </span>
    );
  }

  function MetricCard({
    icon: Icon,
    label,
    valueA,
    valueB,
    delta,
  }: {
    icon: typeof Users;
    label: string;
    valueA: string;
    valueB: string;
    delta: number;
  }) {
    return (
      <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
        <div className="mb-3 flex items-center gap-2 text-xs font-medium text-slate-400">
          <Icon className="h-3.5 w-3.5" />
          {label}
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="text-center flex-1">
            <div className="text-lg font-bold text-blue-400">{valueA}</div>
            <div className="text-[10px] text-slate-600">Scenario A</div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <ArrowRight className="h-4 w-4 text-slate-600" />
            <DeltaBadge value={delta} />
          </div>
          <div className="text-center flex-1">
            <div className="text-lg font-bold text-emerald-400">{valueB}</div>
            <div className="text-[10px] text-slate-600">Scenario B</div>
          </div>
        </div>
      </div>
    );
  }

  const IconA = typeIcons[scenarioA.type];
  const IconB = typeIcons[scenarioB.type];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4 sm:p-8">
      <div className="w-full max-w-5xl rounded-2xl border border-slate-700/50 bg-slate-950 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/30">
              <GitCompareArrows className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100">Scenario Comparison</h2>
              <p className="text-xs text-slate-500">Side-by-side impact analysis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scenario headers side-by-side */}
        <div className="grid grid-cols-2 gap-4 border-b border-slate-800 px-6 py-4">
          {[
            { scenario: scenarioA, label: "A", color: "blue" },
            { scenario: scenarioB, label: "B", color: "emerald" },
          ].map(({ scenario, label, color }) => {
            const Icon = typeIcons[scenario.type];
            return (
              <div
                key={scenario.id}
                className={`rounded-xl border px-4 py-3 ${
                  color === "blue"
                    ? "border-blue-500/20 bg-blue-500/5"
                    : "border-emerald-500/20 bg-emerald-500/5"
                }`}
              >
                <div className="mb-1 flex items-center gap-2">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold ${
                      color === "blue"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-emerald-500/20 text-emerald-400"
                    }`}
                  >
                    {label}
                  </span>
                  <Icon className={`h-4 w-4 ${typeColors[scenario.type]}`} />
                  <span className="text-sm font-semibold text-slate-200 truncate">
                    {scenario.name}
                  </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-1">{scenario.description}</p>
              </div>
            );
          })}
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Key metric deltas */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <MetricCard
              icon={Users}
              label="Affected Population"
              valueA={formatNumber(scenarioA.estimatedAffected)}
              valueB={formatNumber(scenarioB.estimatedAffected)}
              delta={popDelta}
            />
            <MetricCard
              icon={Building2}
              label="Facilities at Risk"
              valueA={formatNumber(scenarioA.estimatedFacilitiesAtRisk)}
              valueB={formatNumber(scenarioB.estimatedFacilitiesAtRisk)}
              delta={facDelta}
            />
            <MetricCard
              icon={Globe}
              label="Countries Affected"
              valueA={String(scenarioA.affectedCountries.length)}
              valueB={String(scenarioB.affectedCountries.length)}
              delta={countryDelta}
            />
          </div>

          {/* Bar chart: affected population by district */}
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-5">
            <h4 className="mb-4 text-sm font-semibold text-slate-300">
              Affected Population by District
            </h4>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis
                    type="number"
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    tickFormatter={(v: number) => formatNumber(v)}
                    axisLine={{ stroke: "#334155" }}
                  />
                  <YAxis
                    dataKey="district"
                    type="category"
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    width={120}
                    axisLine={{ stroke: "#334155" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    labelStyle={{ color: "#e2e8f0" }}
                    formatter={(value?: number) => formatNumber(value ?? 0)}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: "11px", color: "#94a3b8" }}
                  />
                  <Bar
                    dataKey="scenarioA"
                    name={`A: ${scenarioA.name.slice(0, 25)}...`}
                    fill="#3b82f6"
                    radius={[0, 4, 4, 0]}
                    barSize={12}
                  />
                  <Bar
                    dataKey="scenarioB"
                    name={`B: ${scenarioB.name.slice(0, 25)}...`}
                    fill="#10b981"
                    radius={[0, 4, 4, 0]}
                    barSize={12}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Country overlap */}
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-5">
            <h4 className="mb-3 text-sm font-semibold text-slate-300">
              Geographic Overlap
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {/* Scenario A countries */}
              <div>
                <div className="mb-2 text-xs font-medium text-blue-400">Scenario A Countries</div>
                <div className="flex flex-wrap gap-1.5">
                  {scenarioA.affectedCountries.map((c) => {
                    const shared = scenarioB.affectedCountries.includes(c);
                    return (
                      <span
                        key={c}
                        className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                          shared
                            ? "bg-purple-500/15 text-purple-400 border border-purple-500/30"
                            : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        }`}
                      >
                        {c}
                        {shared && " *"}
                      </span>
                    );
                  })}
                </div>
              </div>
              {/* Scenario B countries */}
              <div>
                <div className="mb-2 text-xs font-medium text-emerald-400">
                  Scenario B Countries
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {scenarioB.affectedCountries.map((c) => {
                    const shared = scenarioA.affectedCountries.includes(c);
                    return (
                      <span
                        key={c}
                        className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                          shared
                            ? "bg-purple-500/15 text-purple-400 border border-purple-500/30"
                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        }`}
                      >
                        {c}
                        {shared && " *"}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
            <p className="mt-2 text-[10px] text-slate-600">
              * Indicates country appears in both scenarios (shared overlap)
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-slate-800 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-slate-600 hover:bg-slate-700"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
}
