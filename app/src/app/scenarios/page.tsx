"use client";

import { useState, useMemo } from "react";
import { scenarios as mockScenarios, Scenario } from "@/lib/mock-data";
import ScenarioCard from "@/components/scenarios/ScenarioCard";
import ScenarioBuilder from "@/components/scenarios/ScenarioBuilder";
import ScenarioComparison from "@/components/scenarios/ScenarioComparison";
import ScenarioResults from "@/components/scenarios/ScenarioResults";
import {
  Plus,
  Filter,
  CloudLightning,
  Droplets,
  Sun,
  LayoutGrid,
  List,
  GitCompareArrows,
  Search,
  Layers,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

// ---- Types ----

type TypeFilter = "all" | "cyclone" | "flood" | "drought";
type StatusFilter = "all" | "draft" | "running" | "completed";

const typeFilters: { value: TypeFilter; label: string; icon: typeof CloudLightning }[] = [
  { value: "all", label: "All Types", icon: Layers },
  { value: "cyclone", label: "Cyclone", icon: CloudLightning },
  { value: "flood", label: "Flood", icon: Droplets },
  { value: "drought", label: "Drought", icon: Sun },
];

const statusFilters: { value: StatusFilter; label: string; dotColor: string }[] = [
  { value: "all", label: "All", dotColor: "bg-slate-400" },
  { value: "draft", label: "Draft", dotColor: "bg-slate-400" },
  { value: "running", label: "Running", dotColor: "bg-sky-400" },
  { value: "completed", label: "Completed", dotColor: "bg-emerald-400" },
];

// ---- Page Component ----

export default function ScenariosPage() {
  // Filters
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // UI state
  const [showBuilder, setShowBuilder] = useState(false);
  const [viewingScenario, setViewingScenario] = useState<Scenario | null>(null);

  // Comparison state
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [comparingScenarios, setComparingScenarios] = useState<[Scenario, Scenario] | null>(null);

  // Scenarios (mock -- in production would be from API)
  const [scenarios, setScenarios] = useState<Scenario[]>(mockScenarios);

  // Filtered scenarios
  const filteredScenarios = useMemo(() => {
    return scenarios.filter((s) => {
      if (typeFilter !== "all" && s.type !== typeFilter) return false;
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.createdBy.toLowerCase().includes(q) ||
          s.affectedCountries.some((c) => c.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [scenarios, typeFilter, statusFilter, searchQuery]);

  // Counts for badges
  const countByType = useMemo(() => {
    const counts: Record<string, number> = { all: scenarios.length };
    scenarios.forEach((s) => {
      counts[s.type] = (counts[s.type] || 0) + 1;
    });
    return counts;
  }, [scenarios]);

  const countByStatus = useMemo(() => {
    const counts: Record<string, number> = { all: scenarios.length };
    scenarios.forEach((s) => {
      counts[s.status] = (counts[s.status] || 0) + 1;
    });
    return counts;
  }, [scenarios]);

  // Handlers
  const handleView = (id: string) => {
    const s = scenarios.find((sc) => sc.id === id);
    if (s) setViewingScenario(s);
  };

  const handleCompare = (id: string) => {
    if (!compareMode) {
      setCompareMode(true);
      setSelectedForCompare([id]);
    } else {
      toggleCompareSelection(id);
    }
  };

  const toggleCompareSelection = (id: string) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return [prev[1], id]; // Replace oldest
      return [...prev, id];
    });
  };

  const launchComparison = () => {
    if (selectedForCompare.length !== 2) return;
    const a = scenarios.find((s) => s.id === selectedForCompare[0]);
    const b = scenarios.find((s) => s.id === selectedForCompare[1]);
    if (a && b) setComparingScenarios([a, b]);
  };

  const handleExport = (id: string) => {
    const s = scenarios.find((sc) => sc.id === id);
    if (s) {
      alert(
        `[Mock] Exporting scenario "${s.name}" as JSON...\n\nIn production, this would download the full scenario configuration and results.`
      );
    }
  };

  const handleBuilderComplete = (result: {
    name: string;
    type: "cyclone" | "flood" | "drought";
    countries: string[];
    description: string;
  }) => {
    const newScenario: Scenario = {
      id: `scn-${String(scenarios.length + 1).padStart(3, "0")}`,
      name: result.name,
      type: result.type,
      status: "running",
      createdBy: "Current User",
      createdAt: new Date().toISOString(),
      description: result.description || `New ${result.type} scenario`,
      affectedCountries: result.countries,
      estimatedAffected: Math.round(Math.random() * 1_500_000 + 200_000),
      estimatedFacilitiesAtRisk: Math.round(Math.random() * 400 + 50),
    };
    setScenarios((prev) => [newScenario, ...prev]);
    setShowBuilder(false);
  };

  const exitCompareMode = () => {
    setCompareMode(false);
    setSelectedForCompare([]);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Top bar */}
      <div className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-300"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
              <div className="h-5 w-px bg-slate-800" />
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/30">
                  <Layers className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-sm font-semibold text-slate-100">
                    Impact Scenario Builder
                  </h1>
                  <p className="text-[10px] text-slate-500">
                    Create, compare, and publish disaster impact scenarios
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowBuilder(true)}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
            >
              <Plus className="h-4 w-4" />
              Create New Scenario
            </button>
          </div>
        </div>
      </div>

      {/* Filters bar */}
      <div className="border-b border-slate-800/50 bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-4 py-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scenarios..."
                className="w-full rounded-lg border border-slate-700/50 bg-slate-800/50 py-2 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20"
              />
            </div>

            {/* Type filter */}
            <div className="flex items-center gap-1">
              <Filter className="mr-1 h-3.5 w-3.5 text-slate-600" />
              {typeFilters.map((f) => {
                const Icon = f.icon;
                const isActive = typeFilter === f.value;
                const count = countByType[f.value] ?? 0;
                return (
                  <button
                    key={f.value}
                    onClick={() => setTypeFilter(f.value)}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-slate-700/60 text-slate-200"
                        : "text-slate-500 hover:bg-slate-800/50 hover:text-slate-400"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {f.label}
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                        isActive ? "bg-slate-600 text-slate-300" : "bg-slate-800 text-slate-600"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Status filter */}
            <div className="flex items-center gap-1">
              {statusFilters.map((f) => {
                const isActive = statusFilter === f.value;
                const count = countByStatus[f.value] ?? 0;
                return (
                  <button
                    key={f.value}
                    onClick={() => setStatusFilter(f.value)}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-slate-700/60 text-slate-200"
                        : "text-slate-500 hover:bg-slate-800/50 hover:text-slate-400"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${f.dotColor}`} />
                    {f.label}
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                        isActive ? "bg-slate-600 text-slate-300" : "bg-slate-800 text-slate-600"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Compare mode toggle */}
            <div className="ml-auto flex items-center gap-2">
              {!compareMode ? (
                <button
                  onClick={() => setCompareMode(true)}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-700/50 bg-slate-800/50 px-3 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-400"
                >
                  <GitCompareArrows className="h-3.5 w-3.5" />
                  Compare
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-blue-400">
                    Select 2 scenarios ({selectedForCompare.length}/2)
                  </span>
                  <button
                    onClick={launchComparison}
                    disabled={selectedForCompare.length !== 2}
                    className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <GitCompareArrows className="h-3.5 w-3.5" />
                    Compare
                  </button>
                  <button
                    onClick={exitCompareMode}
                    className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-300"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Results count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Showing {filteredScenarios.length} of {scenarios.length} scenarios
          </p>
        </div>

        {/* Scenario grid */}
        {filteredScenarios.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredScenarios.map((scenario) => (
              <ScenarioCard
                key={scenario.id}
                scenario={scenario}
                onView={handleView}
                onCompare={handleCompare}
                onExport={handleExport}
                selected={selectedForCompare.includes(scenario.id)}
                onSelect={compareMode ? toggleCompareSelection : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700/50 py-20 text-center">
            <Layers className="mb-3 h-10 w-10 text-slate-700" />
            <h3 className="mb-1 text-sm font-semibold text-slate-400">No scenarios found</h3>
            <p className="mb-4 text-xs text-slate-600">
              {searchQuery
                ? `No results matching "${searchQuery}"`
                : "Try adjusting the filters or create a new scenario"}
            </p>
            <button
              onClick={() => {
                setTypeFilter("all");
                setStatusFilter("all");
                setSearchQuery("");
              }}
              className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-300"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Modals / Overlays */}
      {showBuilder && (
        <ScenarioBuilder
          onClose={() => setShowBuilder(false)}
          onComplete={handleBuilderComplete}
        />
      )}

      {viewingScenario && (
        <ScenarioResults
          scenario={viewingScenario}
          onClose={() => setViewingScenario(null)}
          onPublish={(id) => {
            setScenarios((prev) =>
              prev.map((s) => (s.id === id ? { ...s, status: "completed" as const } : s))
            );
            setViewingScenario(null);
          }}
        />
      )}

      {comparingScenarios && (
        <ScenarioComparison
          scenarioA={comparingScenarios[0]}
          scenarioB={comparingScenarios[1]}
          onClose={() => {
            setComparingScenarios(null);
            exitCompareMode();
          }}
        />
      )}
    </div>
  );
}
