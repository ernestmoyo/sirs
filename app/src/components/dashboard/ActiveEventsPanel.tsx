"use client";

import { useState } from "react";
import {
  CloudLightning,
  Droplets,
  Sun,
  Wind,
  ChevronDown,
  ChevronUp,
  Users,
  MapPin,
} from "lucide-react";
import { activeEvents } from "@/lib/mock-data";
import type { ActiveEvent } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";

const EVENT_ICONS: Record<ActiveEvent["type"], React.ReactNode> = {
  cyclone: <Wind className="h-4 w-4" />,
  flood: <Droplets className="h-4 w-4" />,
  drought: <Sun className="h-4 w-4" />,
  storm: <CloudLightning className="h-4 w-4" />,
};

const EVENT_ICON_COLORS: Record<ActiveEvent["type"], string> = {
  cyclone: "text-purple-400 bg-purple-500/15",
  flood: "text-blue-400 bg-blue-500/15",
  drought: "text-amber-400 bg-amber-500/15",
  storm: "text-yellow-400 bg-yellow-500/15",
};

const SEVERITY_BADGES: Record<ActiveEvent["severity"], string> = {
  critical:
    "bg-red-500/15 text-red-400 border border-red-500/30",
  high: "bg-orange-500/15 text-orange-400 border border-orange-500/30",
  moderate:
    "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
  low: "bg-green-500/15 text-green-400 border border-green-500/30",
};

const STATUS_INDICATORS: Record<string, { color: string; label: string }> = {
  active: { color: "bg-red-500", label: "Active" },
  watch: { color: "bg-amber-500", label: "Watch" },
  resolved: { color: "bg-green-500", label: "Resolved" },
};

export default function ActiveEventsPanel() {
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedEvent(expandedEvent === id ? null : id);
  };

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm p-5 h-full flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">
            Active Events
          </h3>
          <p className="text-xs text-slate-500">
            {activeEvents.length} events tracked
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-red-400">
            Live
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto flex-1 pr-1">
        {activeEvents.map((event) => {
          const isExpanded = expandedEvent === event.id;
          const status = STATUS_INDICATORS[event.status];

          return (
            <div
              key={event.id}
              className="rounded-lg border border-slate-700/40 bg-slate-900/50 p-3.5 transition-all duration-200 hover:border-slate-600/50 cursor-pointer"
              onClick={() => toggleExpand(event.id)}
            >
              {/* Header row */}
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${EVENT_ICON_COLORS[event.type]}`}
                >
                  {EVENT_ICONS[event.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${SEVERITY_BADGES[event.severity]}`}
                    >
                      {event.severity}
                    </span>
                    <div className="flex items-center gap-1">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${status.color}`}
                      />
                      <span className="text-[10px] text-slate-500">
                        {status.label}
                      </span>
                    </div>
                  </div>
                  <h4 className="mt-1 text-sm font-medium text-slate-200 leading-tight">
                    {event.name}
                  </h4>

                  {/* Countries + affected */}
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <MapPin className="h-3 w-3" />
                      {event.countries.join(", ")}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Users className="h-3 w-3" />
                      {formatNumber(event.affectedPopulation)} affected
                    </div>
                  </div>
                </div>
                <div className="text-slate-500">
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </div>

              {/* Expanded description */}
              {isExpanded && (
                <div className="mt-3 border-t border-slate-700/30 pt-3">
                  <p className="text-xs leading-relaxed text-slate-400">
                    {event.description}
                  </p>
                  <p className="mt-2 text-[10px] text-slate-600">
                    Started: {event.startDate}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
