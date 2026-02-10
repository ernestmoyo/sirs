"use client";

import { useState, useMemo } from "react";
import {
  Zap,
  AlertTriangle,
  Shield,
  Plus,
  Search,
  Filter,
  SlidersHorizontal,
  ArrowLeft,
  Radio,
  Activity,
  ChevronDown,
} from "lucide-react";
import { triggers, type TriggerConfig } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import TriggerCard from "@/components/triggers/TriggerCard";
import TriggerTimeline from "@/components/triggers/TriggerTimeline";
import TriggerConfigForm from "@/components/triggers/TriggerConfigForm";

type StatusFilter = "all" | "red" | "amber" | "green";

export default function TriggersPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [orgFilter, setOrgFilter] = useState<string>("all");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfigForm, setShowConfigForm] = useState(false);
  const [selectedTrigger, setSelectedTrigger] = useState<TriggerConfig | null>(
    null
  );

  // Derive unique organizations and countries
  const organizations = useMemo(
    () => [...new Set(triggers.map((t) => t.organization))].sort(),
    []
  );
  const countries = useMemo(
    () => [...new Set(triggers.map((t) => t.country))].sort(),
    []
  );

  // Filtered triggers
  const filteredTriggers = useMemo(() => {
    return triggers.filter((t) => {
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (orgFilter !== "all" && t.organization !== orgFilter) return false;
      if (countryFilter !== "all" && t.country !== countryFilter) return false;
      if (
        searchQuery &&
        !t.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !t.metric.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !t.organization.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      return true;
    });
  }, [statusFilter, orgFilter, countryFilter, searchQuery]);

  // Summary counts
  const redCount = triggers.filter((t) => t.status === "red").length;
  const amberCount = triggers.filter((t) => t.status === "amber").length;
  const greenCount = triggers.filter((t) => t.status === "green").length;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <a
                href="/"
                className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm hidden sm:inline">Dashboard</span>
              </a>
              <div className="h-6 w-px bg-slate-700/50" />
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <Radio className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-sm font-semibold text-slate-100">
                    Early Action Triggers
                  </h1>
                  <p className="text-[11px] text-slate-500">
                    Anticipatory Action Monitoring
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Live indicator */}
              <div className="hidden sm:flex items-center gap-2 rounded-full border border-slate-700/50 bg-slate-800/50 px-3 py-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  Live Monitoring
                </span>
              </div>

              <button
                onClick={() => setShowConfigForm(true)}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Configure New Trigger</span>
                <span className="sm:hidden">New</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Red / Active */}
          <button
            onClick={() =>
              setStatusFilter(statusFilter === "red" ? "all" : "red")
            }
            className={cn(
              "relative overflow-hidden rounded-xl border p-4 text-left transition-all group",
              statusFilter === "red"
                ? "border-red-500/50 bg-red-500/10 ring-1 ring-red-500/20"
                : "border-slate-700/50 bg-slate-800/50 hover:border-red-500/30 hover:bg-red-500/5"
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="h-4 w-4 text-red-400" />
                  <span className="text-xs font-medium text-red-400 uppercase tracking-wider">
                    Active Triggers
                  </span>
                </div>
                <div className="text-3xl font-bold text-red-400 tabular-nums">
                  {redCount}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Threshold exceeded -- immediate action required
                </p>
              </div>
              <div className="relative">
                <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <div className="h-6 w-6 rounded-full bg-red-500 animate-pulse-red" />
                </div>
              </div>
            </div>
            {/* Decorative gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent pointer-events-none" />
          </button>

          {/* Amber / Warning */}
          <button
            onClick={() =>
              setStatusFilter(statusFilter === "amber" ? "all" : "amber")
            }
            className={cn(
              "relative overflow-hidden rounded-xl border p-4 text-left transition-all group",
              statusFilter === "amber"
                ? "border-amber-500/50 bg-amber-500/10 ring-1 ring-amber-500/20"
                : "border-slate-700/50 bg-slate-800/50 hover:border-amber-500/30 hover:bg-amber-500/5"
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">
                    Warning
                  </span>
                </div>
                <div className="text-3xl font-bold text-amber-400 tabular-nums">
                  {amberCount}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Approaching threshold -- heightened monitoring
                </p>
              </div>
              <div className="relative">
                <div className="h-12 w-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <div className="h-6 w-6 rounded-full bg-amber-500 animate-pulse-amber" />
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent pointer-events-none" />
          </button>

          {/* Green / Normal */}
          <button
            onClick={() =>
              setStatusFilter(statusFilter === "green" ? "all" : "green")
            }
            className={cn(
              "relative overflow-hidden rounded-xl border p-4 text-left transition-all group",
              statusFilter === "green"
                ? "border-emerald-500/50 bg-emerald-500/10 ring-1 ring-emerald-500/20"
                : "border-slate-700/50 bg-slate-800/50 hover:border-emerald-500/30 hover:bg-emerald-500/5"
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
                    Normal
                  </span>
                </div>
                <div className="text-3xl font-bold text-emerald-400 tabular-nums">
                  {greenCount}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Below threshold -- standard monitoring
                </p>
              </div>
              <div className="relative">
                <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <div className="h-6 w-6 rounded-full bg-emerald-500" />
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent pointer-events-none" />
          </button>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search triggers..."
              className="w-full rounded-lg border border-slate-700/50 bg-slate-800/50 pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <SlidersHorizontal className="h-4 w-4 text-slate-500 hidden sm:block" />

            {/* Organization filter */}
            <div className="relative">
              <select
                value={orgFilter}
                onChange={(e) => setOrgFilter(e.target.value)}
                className="appearance-none rounded-lg border border-slate-700/50 bg-slate-800/50 pl-3 pr-8 py-2 text-xs text-slate-300 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-colors cursor-pointer"
              >
                <option value="all" className="bg-slate-800">
                  All Organizations
                </option>
                {organizations.map((org) => (
                  <option key={org} value={org} className="bg-slate-800">
                    {org}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
            </div>

            {/* Country filter */}
            <div className="relative">
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="appearance-none rounded-lg border border-slate-700/50 bg-slate-800/50 pl-3 pr-8 py-2 text-xs text-slate-300 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-colors cursor-pointer"
              >
                <option value="all" className="bg-slate-800">
                  All Countries
                </option>
                {countries.map((country) => (
                  <option
                    key={country}
                    value={country}
                    className="bg-slate-800"
                  >
                    {country}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
            </div>

            {/* Status filter pills */}
            <div className="flex items-center gap-1 ml-1">
              {(["all", "red", "amber", "green"] as StatusFilter[]).map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={cn(
                      "rounded-md px-2.5 py-1 text-[11px] font-medium border transition-colors",
                      statusFilter === status
                        ? status === "red"
                          ? "bg-red-500/15 text-red-400 border-red-500/30"
                          : status === "amber"
                          ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                          : status === "green"
                          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                          : "bg-blue-500/15 text-blue-400 border-blue-500/30"
                        : "bg-transparent text-slate-500 border-slate-700/30 hover:border-slate-600/50 hover:text-slate-300"
                    )}
                  >
                    {status === "all" ? (
                      "All"
                    ) : (
                      <span className="flex items-center gap-1">
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            status === "red"
                              ? "bg-red-500"
                              : status === "amber"
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                          )}
                        />
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    )}
                  </button>
                )
              )}
            </div>

            {/* Clear filters */}
            {(statusFilter !== "all" ||
              orgFilter !== "all" ||
              countryFilter !== "all" ||
              searchQuery) && (
              <button
                onClick={() => {
                  setStatusFilter("all");
                  setOrgFilter("all");
                  setCountryFilter("all");
                  setSearchQuery("");
                }}
                className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors underline underline-offset-2"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Showing{" "}
            <span className="text-slate-300 font-medium">
              {filteredTriggers.length}
            </span>{" "}
            of{" "}
            <span className="text-slate-300 font-medium">
              {triggers.length}
            </span>{" "}
            triggers
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Activity className="h-3 w-3" />
            Last system check: {new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} UTC
          </div>
        </div>

        {/* Trigger Cards Grid */}
        {filteredTriggers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredTriggers
              .sort((a, b) => {
                const order = { red: 0, amber: 1, green: 2 };
                return order[a.status] - order[b.status];
              })
              .map((trigger) => (
                <TriggerCard
                  key={trigger.id}
                  trigger={trigger}
                  onConfigure={() => setShowConfigForm(true)}
                  onHistory={(t) => setSelectedTrigger(t)}
                  onAcknowledge={(t) =>
                    console.log("Acknowledged:", t.name)
                  }
                />
              ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 rounded-xl border border-dashed border-slate-700/50 bg-slate-800/20">
            <Filter className="h-10 w-10 text-slate-600 mb-3" />
            <p className="text-sm text-slate-400 font-medium">
              No triggers match your filters
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting the search or filter criteria
            </p>
            <button
              onClick={() => {
                setStatusFilter("all");
                setOrgFilter("all");
                setCountryFilter("all");
                setSearchQuery("");
              }}
              className="mt-4 rounded-lg border border-slate-600/50 bg-slate-800/50 px-4 py-2 text-xs text-slate-300 hover:bg-slate-700/50 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      {/* Timeline modal */}
      {selectedTrigger && (
        <TriggerTimeline
          trigger={selectedTrigger}
          onClose={() => setSelectedTrigger(null)}
        />
      )}

      {/* Config form modal */}
      {showConfigForm && (
        <TriggerConfigForm
          onClose={() => setShowConfigForm(false)}
          onSave={(config) => console.log("Saved trigger config:", config)}
        />
      )}
    </div>
  );
}
