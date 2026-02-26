"use client";

import { Scenario } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";
import {
  CloudLightning,
  Droplets,
  Sun,
  Eye,
  GitCompareArrows,
  Download,
  Users,
  Building2,
  Globe,
  Clock,
  User,
} from "lucide-react";
import AIScenarioBrief from "@/components/ai/AIScenarioBrief";

const typeConfig: Record<
  Scenario["type"],
  { icon: typeof CloudLightning; color: string; bg: string; border: string; label: string }
> = {
  cyclone: {
    icon: CloudLightning,
    color: "text-violet-400",
    bg: "bg-violet-500/15",
    border: "border-violet-500/30",
    label: "Cyclone",
  },
  flood: {
    icon: Droplets,
    color: "text-blue-400",
    bg: "bg-blue-500/15",
    border: "border-blue-500/30",
    label: "Flood",
  },
  drought: {
    icon: Sun,
    color: "text-amber-400",
    bg: "bg-amber-500/15",
    border: "border-amber-500/30",
    label: "Drought",
  },
};

const statusConfig: Record<
  Scenario["status"],
  { color: string; bg: string; border: string; dot: string; label: string }
> = {
  draft: {
    color: "text-slate-400",
    bg: "bg-slate-500/15",
    border: "border-slate-500/30",
    dot: "bg-slate-400",
    label: "Draft",
  },
  running: {
    color: "text-sky-400",
    bg: "bg-sky-500/15",
    border: "border-sky-500/30",
    dot: "bg-sky-400",
    label: "Running",
  },
  completed: {
    color: "text-emerald-400",
    bg: "bg-emerald-500/15",
    border: "border-emerald-500/30",
    dot: "bg-emerald-400",
    label: "Completed",
  },
};

interface ScenarioCardProps {
  scenario: Scenario;
  onView?: (id: string) => void;
  onCompare?: (id: string) => void;
  onExport?: (id: string) => void;
  selected?: boolean;
  onSelect?: (id: string) => void;
}

export default function ScenarioCard({
  scenario,
  onView,
  onCompare,
  onExport,
  selected = false,
  onSelect,
}: ScenarioCardProps) {
  const type = typeConfig[scenario.type];
  const status = statusConfig[scenario.status];
  const TypeIcon = type.icon;

  const createdDate = new Date(scenario.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const createdTime = new Date(scenario.createdAt).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`group relative rounded-xl border transition-all duration-200 ${
        selected
          ? "border-blue-500/60 bg-blue-500/5 ring-1 ring-blue-500/30"
          : "border-slate-700/50 bg-slate-800/50 hover:border-slate-600/60 hover:bg-slate-800/70"
      }`}
    >
      {/* Selection checkbox overlay */}
      {onSelect && (
        <button
          onClick={() => onSelect(scenario.id)}
          className={`absolute top-3 right-3 z-10 flex h-5 w-5 items-center justify-center rounded border transition-colors ${
            selected
              ? "border-blue-500 bg-blue-500 text-white"
              : "border-slate-600 bg-slate-800 text-transparent hover:border-slate-500"
          }`}
        >
          {selected && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 6L5 9L10 3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      )}

      <div className="p-5">
        {/* Header row: type badge + status badge */}
        <div className="mb-3 flex items-center justify-between">
          <div
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${type.bg} ${type.border} ${type.color}`}
          >
            <TypeIcon className="h-3.5 w-3.5" />
            {type.label}
          </div>

          <div
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${status.bg} ${status.border} ${status.color}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${status.dot} ${
              scenario.status === "running" ? "animate-pulse" : ""
            }`} />
            {status.label}
          </div>
        </div>

        {/* Title and description */}
        <h3 className="mb-1.5 text-sm font-semibold text-slate-100 leading-snug">
          {scenario.name}
        </h3>
        <p className="mb-4 text-xs leading-relaxed text-slate-400 line-clamp-2">
          {scenario.description}
        </p>

        {/* Key metrics */}
        <div className="mb-4 grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center rounded-lg bg-slate-900/60 px-2 py-2.5">
            <Users className="mb-1 h-3.5 w-3.5 text-slate-500" />
            <span className="text-sm font-semibold text-slate-200">
              {formatNumber(scenario.estimatedAffected)}
            </span>
            <span className="text-[10px] text-slate-500">Affected</span>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-slate-900/60 px-2 py-2.5">
            <Building2 className="mb-1 h-3.5 w-3.5 text-slate-500" />
            <span className="text-sm font-semibold text-slate-200">
              {formatNumber(scenario.estimatedFacilitiesAtRisk)}
            </span>
            <span className="text-[10px] text-slate-500">Facilities</span>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-slate-900/60 px-2 py-2.5">
            <Globe className="mb-1 h-3.5 w-3.5 text-slate-500" />
            <span className="text-sm font-semibold text-slate-200">
              {scenario.affectedCountries.length}
            </span>
            <span className="text-[10px] text-slate-500">
              {scenario.affectedCountries.length === 1 ? "Country" : "Countries"}
            </span>
          </div>
        </div>

        {/* Meta: created by + date */}
        <div className="mb-4 flex items-center gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{scenario.createdBy}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{createdDate} {createdTime}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView?.(scenario.id)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-slate-600 hover:bg-slate-700 hover:text-slate-100"
          >
            <Eye className="h-3.5 w-3.5" />
            View
          </button>
          <button
            onClick={() => onCompare?.(scenario.id)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-400"
          >
            <GitCompareArrows className="h-3.5 w-3.5" />
            Compare
          </button>
          <button
            onClick={() => onExport?.(scenario.id)}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-slate-600 hover:bg-slate-700 hover:text-slate-100"
          >
            <Download className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* AI Scenario Brief */}
        <AIScenarioBrief
          name={scenario.name}
          type={scenario.type}
          status={scenario.status}
          affectedPop={scenario.estimatedAffected}
          facilities={scenario.estimatedFacilitiesAtRisk}
          countries={scenario.affectedCountries}
          createdBy={scenario.createdBy}
          date={createdDate}
        />
      </div>
    </div>
  );
}
