"use client";

import { useState, useMemo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { sadcCountries } from "@/lib/mock-data";
import type { CountryRisk } from "@/lib/mock-data";
import { getRiskColor, getRiskLevel, formatNumber, cn } from "@/lib/utils";

type SortKey =
  | "name"
  | "riskScore"
  | "hazardScore"
  | "exposureScore"
  | "vulnerabilityScore"
  | "affectedPopulation"
  | "activeAlerts";

type SortDirection = "asc" | "desc";

interface ColumnDef {
  key: SortKey;
  label: string;
  shortLabel?: string;
}

const columns: ColumnDef[] = [
  { key: "name", label: "Country" },
  { key: "riskScore", label: "Risk Score" },
  { key: "hazardScore", label: "Hazard", shortLabel: "Haz" },
  { key: "exposureScore", label: "Exposure", shortLabel: "Exp" },
  { key: "vulnerabilityScore", label: "Vulnerability", shortLabel: "Vuln" },
  { key: "affectedPopulation", label: "Affected Pop." },
  { key: "activeAlerts", label: "Alerts" },
];

export default function CountryRiskTable() {
  const [sortKey, setSortKey] = useState<SortKey>("riskScore");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sortedCountries = useMemo(() => {
    const sorted = [...sadcCountries].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortDir === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });
    return sorted;
  }, [sortKey, sortDir]);

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) {
      return <ArrowUpDown className="h-3 w-3 text-slate-600" />;
    }
    return sortDir === "asc" ? (
      <ArrowUp className="h-3 w-3 text-blue-400" />
    ) : (
      <ArrowDown className="h-3 w-3 text-blue-400" />
    );
  };

  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-200">
          Country Risk Index
        </h3>
        <p className="text-xs text-slate-500">
          All SADC member states &middot; Sortable
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-700/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="cursor-pointer select-none pb-3 pr-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 transition-colors hover:text-slate-200"
                >
                  <div className="flex items-center gap-1">
                    <span>{col.shortLabel || col.label}</span>
                    <SortIcon column={col.key} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedCountries.map((country, index) => {
              const riskColor = getRiskColor(country.riskScore);
              return (
                <tr
                  key={country.id}
                  className={cn(
                    "border-b border-slate-700/20 transition-colors hover:bg-slate-700/20",
                    index === sortedCountries.length - 1 && "border-b-0"
                  )}
                >
                  {/* Country name */}
                  <td className="py-2.5 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-200">
                        {country.name}
                      </span>
                      <span className="text-[10px] text-slate-600">
                        {country.code}
                      </span>
                    </div>
                  </td>

                  {/* Risk score with color bar */}
                  <td className="py-2.5 pr-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-slate-700 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${country.riskScore * 100}%`,
                            backgroundColor: riskColor,
                          }}
                        />
                      </div>
                      <span
                        className="text-xs font-bold tabular-nums"
                        style={{ color: riskColor }}
                      >
                        {(country.riskScore * 10).toFixed(1)}
                      </span>
                    </div>
                  </td>

                  {/* Hazard */}
                  <td className="py-2.5 pr-3">
                    <span
                      className="text-xs tabular-nums"
                      style={{ color: getRiskColor(country.hazardScore) }}
                    >
                      {(country.hazardScore * 10).toFixed(1)}
                    </span>
                  </td>

                  {/* Exposure */}
                  <td className="py-2.5 pr-3">
                    <span
                      className="text-xs tabular-nums"
                      style={{ color: getRiskColor(country.exposureScore) }}
                    >
                      {(country.exposureScore * 10).toFixed(1)}
                    </span>
                  </td>

                  {/* Vulnerability */}
                  <td className="py-2.5 pr-3">
                    <span
                      className="text-xs tabular-nums"
                      style={{
                        color: getRiskColor(country.vulnerabilityScore),
                      }}
                    >
                      {(country.vulnerabilityScore * 10).toFixed(1)}
                    </span>
                  </td>

                  {/* Affected Population */}
                  <td className="py-2.5 pr-3">
                    <span className="text-xs text-slate-300 tabular-nums">
                      {formatNumber(country.affectedPopulation)}
                    </span>
                  </td>

                  {/* Active Alerts */}
                  <td className="py-2.5">
                    {country.activeAlerts > 0 ? (
                      <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500/15 px-1.5 text-[10px] font-bold text-red-400 border border-red-500/30">
                        {country.activeAlerts}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-600">&mdash;</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
