"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { sadcCountries, activeEvents } from "@/lib/mock-data";
import { getRiskColor, getRiskLevel, formatNumber } from "@/lib/utils";

// Dynamically import the map inner component with no SSR
const MapInner = dynamic(() => import("./RegionalRiskMapInner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center rounded-xl bg-slate-900/50">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-blue-400" />
        <p className="text-xs text-slate-500">Loading map...</p>
      </div>
    </div>
  ),
});

// Legend component
function MapLegend() {
  const levels = [
    { label: "Critical", color: "#ef4444", range: "8.0-10" },
    { label: "High", color: "#f97316", range: "6.0-7.9" },
    { label: "Moderate", color: "#eab308", range: "4.0-5.9" },
    { label: "Low", color: "#22c55e", range: "2.0-3.9" },
    { label: "Minimal", color: "#3b82f6", range: "0-1.9" },
  ];

  return (
    <div className="absolute bottom-4 left-4 z-[1000] rounded-lg border border-slate-700/50 bg-slate-800/90 px-3 py-2.5 backdrop-blur-sm">
      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        Risk Level
      </p>
      <div className="flex flex-col gap-1">
        {levels.map((level) => (
          <div key={level.label} className="flex items-center gap-2">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: level.color }}
            />
            <span className="text-[10px] text-slate-300">{level.label}</span>
            <span className="text-[10px] text-slate-500">({level.range})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RegionalRiskMap() {
  return (
    <div className="relative h-full min-h-[450px] rounded-xl border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm overflow-hidden">
      <div className="absolute left-5 top-4 z-[1000]">
        <h3 className="text-sm font-semibold text-slate-200">
          Regional Risk Overview
        </h3>
        <p className="text-xs text-slate-500">
          SADC Member States &middot; {sadcCountries.length} countries
        </p>
      </div>
      <MapInner />
      <MapLegend />
    </div>
  );
}
