"use client";

import Link from "next/link";
import { sadcCountries } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";
import {
  Heart,
  Wheat,
  Truck,
  Shield,
  ArrowRight,
  Activity,
  Building2,
  Users,
  AlertTriangle,
} from "lucide-react";

// Aggregate overview stats from mock data
function computeOverviewStats() {
  const allDistricts = sadcCountries.flatMap((c) => c.districts);
  const totalHealth = allDistricts.reduce((s, d) => s + d.facilities.health, 0);
  const healthAtRisk = allDistricts.reduce(
    (s, d) => s + d.facilities.healthAtRisk,
    0
  );
  const totalWash = allDistricts.reduce((s, d) => s + d.facilities.wash, 0);
  const washAtRisk = allDistricts.reduce(
    (s, d) => s + d.facilities.washAtRisk,
    0
  );
  const totalAffected = sadcCountries.reduce(
    (s, c) => s + c.affectedPopulation,
    0
  );
  const countriesWithAlerts = sadcCountries.filter(
    (c) => c.activeAlerts > 0
  ).length;

  return {
    totalHealth,
    healthAtRisk,
    totalWash,
    washAtRisk,
    totalAffected,
    countriesWithAlerts,
    totalFacilities: totalHealth + totalWash,
    totalAtRisk: healthAtRisk + washAtRisk,
  };
}

const lensCards = [
  {
    id: "health-wash",
    title: "Health / WASH",
    icon: Heart,
    accent: "emerald",
    accentColor: "#10b981",
    description:
      "Monitor health facility status, WASH infrastructure integrity, patient impact, and water supply disruptions across the SADC region.",
    stats: (overview: ReturnType<typeof computeOverviewStats>) => [
      {
        label: "Health Facilities",
        value: formatNumber(overview.totalHealth),
      },
      { label: "At Risk", value: formatNumber(overview.healthAtRisk) },
      { label: "WASH Sites", value: formatNumber(overview.totalWash) },
      { label: "WASH At Risk", value: formatNumber(overview.washAtRisk) },
    ],
  },
  {
    id: "food-security",
    title: "Food Security",
    icon: Wheat,
    accent: "amber",
    accentColor: "#f59e0b",
    description:
      "Track IPC food insecurity classifications, crop loss estimates, market disruptions, and affected farming household counts.",
    stats: () => [
      { label: "IPC Phase 3+", value: "1.9M" },
      { label: "Markets Monitored", value: "6" },
      { label: "Crop Loss Risk", value: "High" },
      { label: "Affected HH", value: "~850K" },
    ],
  },
  {
    id: "logistics",
    title: "Logistics / Infrastructure",
    icon: Truck,
    accent: "cyan",
    accentColor: "#06b6d4",
    description:
      "Assess road network accessibility, bridge status, warehouse capacity, and supply route disruptions for humanitarian response.",
    stats: () => [
      { label: "Corridors", value: "8" },
      { label: "Cut-off", value: "2" },
      { label: "Bridges Affected", value: "5" },
      { label: "Warehouse Cap.", value: "48.5K MT" },
    ],
  },
  {
    id: "social-protection",
    title: "Social Protection",
    icon: Shield,
    accent: "purple",
    accentColor: "#a855f7",
    description:
      "Manage anticipatory cash transfer eligibility, beneficiary registry coverage, poverty index overlays, and coverage gap analysis.",
    stats: (overview: ReturnType<typeof computeOverviewStats>) => [
      { label: "Eligible HH", value: "~680K" },
      { label: "Registry Coverage", value: "~62%" },
      { label: "Coverage Gap", value: "~260K" },
      { label: "Countries", value: "4" },
    ],
  },
];

const accentStyles: Record<string, { border: string; bg: string; text: string; hoverBg: string; iconBg: string }> = {
  emerald: {
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/5",
    text: "text-emerald-400",
    hoverBg: "hover:bg-emerald-500/10",
    iconBg: "bg-emerald-500/15",
  },
  amber: {
    border: "border-amber-500/30",
    bg: "bg-amber-500/5",
    text: "text-amber-400",
    hoverBg: "hover:bg-amber-500/10",
    iconBg: "bg-amber-500/15",
  },
  cyan: {
    border: "border-cyan-500/30",
    bg: "bg-cyan-500/5",
    text: "text-cyan-400",
    hoverBg: "hover:bg-cyan-500/10",
    iconBg: "bg-cyan-500/15",
  },
  purple: {
    border: "border-purple-500/30",
    bg: "bg-purple-500/5",
    text: "text-purple-400",
    hoverBg: "hover:bg-purple-500/10",
    iconBg: "bg-purple-500/15",
  },
};

export default function SectorsPage() {
  const overview = computeOverviewStats();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="text-zinc-400 hover:text-zinc-200 transition-colors text-sm"
              >
                SIRS
              </Link>
              <span className="text-zinc-700">/</span>
              <h1 className="text-lg font-semibold text-zinc-100">
                Sector Lenses
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Activity className="h-3.5 w-3.5 text-emerald-500" />
              <span>Live Analysis</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-zinc-100 mb-2">
            Sector Analysis Lenses
          </h2>
          <p className="text-zinc-400 text-sm max-w-2xl">
            Configurable analytical overlays for sector-specific decision-making.
            Select a lens to access detailed indicators, risk assessments, and
            operational data tailored to each humanitarian sector.
          </p>
        </div>

        {/* Overview Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="h-4 w-4 text-zinc-500" />
              <span className="text-xs text-zinc-500 uppercase tracking-wider">
                Total Facilities
              </span>
            </div>
            <div className="text-xl font-bold text-zinc-100">
              {formatNumber(overview.totalFacilities)}
            </div>
            <div className="text-xs text-zinc-600">
              Health + WASH monitored
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-xs text-zinc-500 uppercase tracking-wider">
                Facilities at Risk
              </span>
            </div>
            <div className="text-xl font-bold text-red-400">
              {formatNumber(overview.totalAtRisk)}
            </div>
            <div className="text-xs text-zinc-600">
              {Math.round(
                (overview.totalAtRisk / overview.totalFacilities) * 100
              )}
              % of total
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-orange-500" />
              <span className="text-xs text-zinc-500 uppercase tracking-wider">
                Affected Population
              </span>
            </div>
            <div className="text-xl font-bold text-orange-400">
              {formatNumber(overview.totalAffected)}
            </div>
            <div className="text-xs text-zinc-600">Across SADC region</div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-4 w-4 text-amber-500" />
              <span className="text-xs text-zinc-500 uppercase tracking-wider">
                Countries Alerted
              </span>
            </div>
            <div className="text-xl font-bold text-amber-400">
              {overview.countriesWithAlerts}
            </div>
            <div className="text-xs text-zinc-600">
              of {sadcCountries.length} SADC members
            </div>
          </div>
        </div>

        {/* Lens Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {lensCards.map((lens) => {
            const style = accentStyles[lens.accent];
            const Icon = lens.icon;
            const stats = lens.stats(overview);

            return (
              <div
                key={lens.id}
                className={`rounded-2xl border ${style.border} ${style.bg} ${style.hoverBg} transition-all duration-200 group`}
              >
                <div className="p-6">
                  {/* Icon and Title */}
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-xl ${style.iconBg}`}
                    >
                      <Icon className={`h-6 w-6 ${style.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-zinc-100 mb-1">
                        {lens.title}
                      </h3>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        {lens.description}
                      </p>
                    </div>
                  </div>

                  {/* Key Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                    {stats.map((stat, i) => (
                      <div
                        key={i}
                        className="rounded-lg bg-zinc-900/60 border border-zinc-800/50 p-2.5 text-center"
                      >
                        <div className={`text-sm font-bold ${style.text}`}>
                          {stat.value}
                        </div>
                        <div className="text-xs text-zinc-500 mt-0.5">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Enter Lens Button */}
                  <Link
                    href={`/sectors/${lens.id}`}
                    className={`inline-flex items-center gap-2 rounded-lg border ${style.border} px-5 py-2.5 text-sm font-medium ${style.text} ${style.hoverBg} transition-all duration-200 group-hover:gap-3`}
                  >
                    Enter Lens
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
