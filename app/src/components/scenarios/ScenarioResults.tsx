"use client";

import { useMemo } from "react";
import { Scenario, sadcCountries } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";
import {
  Users,
  Building2,
  Heart,
  Droplets,
  GraduationCap,
  Globe,
  FileText,
  Presentation,
  Shield,
  X,
  CloudLightning,
  Sun,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

// ---- Types ----

interface DistrictResult {
  name: string;
  country: string;
  affectedPopulation: number;
  healthAtRisk: number;
  washAtRisk: number;
  schoolsAtRisk: number;
  riskScore: number;
}

const typeIcons: Record<Scenario["type"], typeof CloudLightning> = {
  cyclone: CloudLightning,
  flood: Droplets,
  drought: Sun,
};

const typeLabels: Record<Scenario["type"], string> = {
  cyclone: "Cyclone",
  flood: "Flood",
  drought: "Drought",
};

const typeColors: Record<Scenario["type"], { text: string; bg: string; border: string }> = {
  cyclone: { text: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/30" },
  flood: { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
  drought: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
};

// ---- Generate mock detailed results ----

function generateDistrictResults(scenario: Scenario): DistrictResult[] {
  const results: DistrictResult[] = [];
  const seed = scenario.id.charCodeAt(scenario.id.length - 1);

  scenario.affectedCountries.forEach((countryName) => {
    const country = sadcCountries.find((c) => c.name === countryName);
    if (country && country.districts.length > 0) {
      country.districts.forEach((d, i) => {
        const factor = ((seed + i * 13) % 80 + 20) / 100;
        results.push({
          name: d.name,
          country: countryName,
          affectedPopulation: Math.round(d.affectedPopulation * factor),
          healthAtRisk: Math.round(d.facilities.healthAtRisk * factor),
          washAtRisk: Math.round(d.facilities.washAtRisk * factor),
          schoolsAtRisk: Math.round(d.facilities.schoolsAtRisk * factor),
          riskScore: Math.round(d.riskScore * factor * 100) / 100,
        });
      });
    } else {
      // Synthetic district for countries without detailed data
      const pop = Math.round(
        (scenario.estimatedAffected / scenario.affectedCountries.length) *
          ((seed % 40 + 60) / 100)
      );
      const facBase = Math.round(scenario.estimatedFacilitiesAtRisk / scenario.affectedCountries.length);
      results.push({
        name: `${countryName} (National)`,
        country: countryName,
        affectedPopulation: pop,
        healthAtRisk: Math.round(facBase * 0.3),
        washAtRisk: Math.round(facBase * 0.4),
        schoolsAtRisk: Math.round(facBase * 0.3),
        riskScore: 0.65 + (seed % 20) / 100,
      });
    }
  });

  return results.sort((a, b) => b.affectedPopulation - a.affectedPopulation);
}

// ---- Component ----

interface ScenarioResultsProps {
  scenario: Scenario;
  onClose: () => void;
  onPublish?: (id: string) => void;
}

export default function ScenarioResults({
  scenario,
  onClose,
  onPublish,
}: ScenarioResultsProps) {
  const districtResults = useMemo(() => generateDistrictResults(scenario), [scenario]);

  const totalHealth = districtResults.reduce((sum, d) => sum + d.healthAtRisk, 0);
  const totalWash = districtResults.reduce((sum, d) => sum + d.washAtRisk, 0);
  const totalSchools = districtResults.reduce((sum, d) => sum + d.schoolsAtRisk, 0);
  const totalFacilities = totalHealth + totalWash + totalSchools;

  const TypeIcon = typeIcons[scenario.type];
  const colors = typeColors[scenario.type];

  const handleExportPDF = () => {
    alert(
      `[Mock] Exporting "${scenario.name}" results to PDF...\n\nIn production, this would generate a formatted PDF report with all impact data, charts, and methodology notes.`
    );
  };

  const handleExportPPTX = () => {
    alert(
      `[Mock] Exporting "${scenario.name}" results to PowerPoint...\n\nIn production, this would generate a slide deck suitable for briefings and stakeholder presentations.`
    );
  };

  const handlePublish = () => {
    if (
      confirm(
        `Publish "${scenario.name}" as an official SADC scenario?\n\nThis will make the scenario and its results visible to all SADC member state users.`
      )
    ) {
      onPublish?.(scenario.id);
    }
  };

  function getRiskBg(score: number) {
    if (score >= 0.8) return "bg-red-500/15 text-red-400";
    if (score >= 0.6) return "bg-orange-500/15 text-orange-400";
    if (score >= 0.4) return "bg-yellow-500/15 text-yellow-400";
    return "bg-green-500/15 text-green-400";
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4 sm:p-8">
      <div className="w-full max-w-5xl rounded-2xl border border-slate-700/50 bg-slate-950 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${colors.bg} ${colors.border}`}
            >
              <TypeIcon className={`h-5 w-5 ${colors.text}`} />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-slate-100 truncate">
                {scenario.name}
              </h2>
              <p className="text-xs text-slate-500 truncate">{scenario.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[65vh] overflow-y-auto px-6 py-5 space-y-6">
          {/* Summary stat cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <SummaryStatCard
              icon={Users}
              label="Affected Population"
              value={formatNumber(scenario.estimatedAffected)}
              subtext={`Across ${scenario.affectedCountries.length} ${scenario.affectedCountries.length === 1 ? "country" : "countries"}`}
              iconColor="text-red-400"
              iconBg="bg-red-500/10"
            />
            <SummaryStatCard
              icon={Building2}
              label="Facilities at Risk"
              value={formatNumber(totalFacilities)}
              subtext={`${totalHealth} health, ${totalWash} WASH, ${totalSchools} schools`}
              iconColor="text-orange-400"
              iconBg="bg-orange-500/10"
            />
            <SummaryStatCard
              icon={Globe}
              label="Countries"
              value={String(scenario.affectedCountries.length)}
              subtext={scenario.affectedCountries.join(", ")}
              iconColor="text-blue-400"
              iconBg="bg-blue-500/10"
            />
            <SummaryStatCard
              icon={AlertTriangle}
              label="Districts Impacted"
              value={String(districtResults.length)}
              subtext="With modeled impact data"
              iconColor="text-amber-400"
              iconBg="bg-amber-500/10"
            />
          </div>

          {/* Facility impact breakdown */}
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-5">
            <h4 className="mb-4 text-sm font-semibold text-slate-300">
              Facility Impact by Type
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <FacilityBar
                icon={Heart}
                label="Health Facilities"
                count={totalHealth}
                color="text-red-400"
                barColor="bg-red-500"
                maxCount={totalFacilities}
              />
              <FacilityBar
                icon={Droplets}
                label="WASH Facilities"
                count={totalWash}
                color="text-blue-400"
                barColor="bg-blue-500"
                maxCount={totalFacilities}
              />
              <FacilityBar
                icon={GraduationCap}
                label="Schools"
                count={totalSchools}
                color="text-amber-400"
                barColor="bg-amber-500"
                maxCount={totalFacilities}
              />
            </div>
          </div>

          {/* District impact table */}
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/30">
            <div className="border-b border-slate-700/50 px-5 py-3">
              <h4 className="text-sm font-semibold text-slate-300">
                Impact Breakdown by District
              </h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/30">
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
                      District
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
                      Country
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">
                      Affected Pop.
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">
                      Health
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">
                      WASH
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">
                      Schools
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-slate-500">
                      Risk
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {districtResults.map((district, idx) => (
                    <tr
                      key={`${district.country}-${district.name}`}
                      className={`border-b border-slate-700/20 transition-colors hover:bg-slate-800/40 ${
                        idx % 2 === 0 ? "bg-slate-900/20" : ""
                      }`}
                    >
                      <td className="px-4 py-2.5 text-sm font-medium text-slate-200">
                        {district.name}
                      </td>
                      <td className="px-4 py-2.5 text-sm text-slate-400">
                        {district.country}
                      </td>
                      <td className="px-4 py-2.5 text-right text-sm tabular-nums font-medium text-slate-200">
                        {formatNumber(district.affectedPopulation)}
                      </td>
                      <td className="px-4 py-2.5 text-right text-sm tabular-nums text-red-400">
                        {district.healthAtRisk}
                      </td>
                      <td className="px-4 py-2.5 text-right text-sm tabular-nums text-blue-400">
                        {district.washAtRisk}
                      </td>
                      <td className="px-4 py-2.5 text-right text-sm tabular-nums text-amber-400">
                        {district.schoolsAtRisk}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <span
                          className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold tabular-nums ${getRiskBg(
                            district.riskScore
                          )}`}
                        >
                          {district.riskScore.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {/* Totals row */}
                <tfoot>
                  <tr className="border-t border-slate-600/50 bg-slate-800/40">
                    <td className="px-4 py-2.5 text-sm font-semibold text-slate-200">Total</td>
                    <td className="px-4 py-2.5 text-sm text-slate-500">
                      {scenario.affectedCountries.length} countries
                    </td>
                    <td className="px-4 py-2.5 text-right text-sm tabular-nums font-semibold text-slate-200">
                      {formatNumber(
                        districtResults.reduce((s, d) => s + d.affectedPopulation, 0)
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-right text-sm tabular-nums font-semibold text-red-400">
                      {totalHealth}
                    </td>
                    <td className="px-4 py-2.5 text-right text-sm tabular-nums font-semibold text-blue-400">
                      {totalWash}
                    </td>
                    <td className="px-4 py-2.5 text-right text-sm tabular-nums font-semibold text-amber-400">
                      {totalSchools}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Footer / actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 px-6 py-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-slate-600 hover:bg-slate-700 hover:text-slate-100"
            >
              <FileText className="h-3.5 w-3.5" />
              Export to PDF
            </button>
            <button
              onClick={handleExportPPTX}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-slate-600 hover:bg-slate-700 hover:text-slate-100"
            >
              <Presentation className="h-3.5 w-3.5" />
              Export to PowerPoint
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePublish}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-emerald-500"
            >
              <Shield className="h-3.5 w-3.5" />
              Publish as Official
            </button>
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-slate-600 hover:bg-slate-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Sub-components ----

function SummaryStatCard({
  icon: Icon,
  label,
  value,
  subtext,
  iconColor,
  iconBg,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  subtext: string;
  iconColor: string;
  iconBg: string;
}) {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
      <div className="mb-2 flex items-center gap-2">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconBg}`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
      </div>
      <div className="text-xl font-bold text-slate-100 tabular-nums">{value}</div>
      <div className="text-xs font-medium text-slate-400">{label}</div>
      <div className="mt-1 text-[10px] text-slate-600 truncate">{subtext}</div>
    </div>
  );
}

function FacilityBar({
  icon: Icon,
  label,
  count,
  color,
  barColor,
  maxCount,
}: {
  icon: typeof Heart;
  label: string;
  count: number;
  color: string;
  barColor: string;
  maxCount: number;
}) {
  const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
  return (
    <div className="flex flex-col items-center text-center">
      <Icon className={`mb-2 h-5 w-5 ${color}`} />
      <div className="text-lg font-bold text-slate-100 tabular-nums">{count}</div>
      <div className="mb-2 text-xs text-slate-500">{label}</div>
      <div className="h-1.5 w-full rounded-full bg-slate-700">
        <div
          className={`h-1.5 rounded-full ${barColor} transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-1 text-[10px] text-slate-600">{pct.toFixed(0)}% of total</div>
    </div>
  );
}
