"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { riskTimeSeries } from "@/lib/mock-data";

const COUNTRY_COLORS = {
  mozambique: { stroke: "#ef4444", fill: "#ef4444" },
  malawi: { stroke: "#f97316", fill: "#f97316" },
  madagascar: { stroke: "#eab308", fill: "#eab308" },
  tanzania: { stroke: "#3b82f6", fill: "#3b82f6" },
};

const COUNTRY_LABELS: Record<string, string> = {
  mozambique: "Mozambique",
  malawi: "Malawi",
  madagascar: "Madagascar",
  tanzania: "Tanzania",
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload) return null;
  return (
    <div className="rounded-lg border border-slate-700/50 bg-slate-800/95 px-4 py-3 shadow-xl backdrop-blur-sm">
      <p className="mb-2 text-xs font-medium text-slate-400">{label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2 py-0.5">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-slate-300">
            {COUNTRY_LABELS[entry.dataKey] || entry.dataKey}:
          </span>
          <span className="text-xs font-semibold text-slate-100">
            {(entry.value * 10).toFixed(1)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function RiskTrendChart() {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">
            Risk Score Trends
          </h3>
          <p className="text-xs text-slate-500">
            Top 4 countries &middot; Last 10 days
          </p>
        </div>
        <div className="flex gap-3">
          {Object.entries(COUNTRY_COLORS).map(([key, colors]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: colors.stroke }}
              />
              <span className="text-[10px] text-slate-400">
                {COUNTRY_LABELS[key]}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={riskTimeSeries}
            margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
          >
            <defs>
              {Object.entries(COUNTRY_COLORS).map(([key, colors]) => (
                <linearGradient
                  key={key}
                  id={`gradient-${key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={colors.fill}
                    stopOpacity={0.25}
                  />
                  <stop
                    offset="95%"
                    stopColor={colors.fill}
                    stopOpacity={0}
                  />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(100,116,139,0.15)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={{ stroke: "rgba(100,116,139,0.2)" }}
              tickLine={false}
            />
            <YAxis
              domain={[0.2, 1.0]}
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => (v * 10).toFixed(0)}
            />
            <Tooltip content={<CustomTooltip />} />
            {Object.entries(COUNTRY_COLORS).map(([key, colors]) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors.stroke}
                strokeWidth={2}
                fill={`url(#gradient-${key})`}
                dot={false}
                activeDot={{
                  r: 4,
                  strokeWidth: 2,
                  stroke: colors.stroke,
                  fill: "#0f172a",
                }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
