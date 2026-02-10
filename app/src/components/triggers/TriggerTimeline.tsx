"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  Dot,
} from "recharts";
import {
  X,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Zap,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import type { TriggerConfig } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface TriggerTimelineProps {
  trigger: TriggerConfig;
  onClose: () => void;
}

interface ChartDataPoint {
  date: string;
  value: number;
  isActivation: boolean;
}

// Custom dot that renders special markers on activation points
function ActivationDot(props: {
  cx?: number;
  cy?: number;
  payload?: ChartDataPoint;
  threshold: number;
}) {
  const { cx, cy, payload, threshold } = props;
  if (!cx || !cy || !payload) return null;

  // Mark points where value crosses threshold
  if (payload.value >= threshold) {
    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={6}
          fill="rgba(239, 68, 68, 0.3)"
          stroke="#ef4444"
          strokeWidth={2}
        />
        <circle cx={cx} cy={cy} r={3} fill="#ef4444" />
      </g>
    );
  }

  return (
    <Dot
      cx={cx}
      cy={cy}
      r={3}
      fill="#64748b"
      stroke="#94a3b8"
      strokeWidth={1}
    />
  );
}

function CustomTooltip({
  active,
  payload,
  label,
  threshold,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  threshold: number;
}) {
  if (!active || !payload || !payload.length) return null;

  const value = payload[0].value;
  const isAbove = value >= threshold;

  return (
    <div className="rounded-lg border border-slate-600/50 bg-slate-800 px-3 py-2 shadow-xl">
      <div className="flex items-center gap-2 mb-1">
        <Calendar className="h-3 w-3 text-slate-400" />
        <span className="text-xs text-slate-400">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "text-lg font-bold tabular-nums",
            isAbove ? "text-red-400" : "text-slate-200"
          )}
        >
          {value.toFixed(3)}
        </span>
        {isAbove && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-500/30 font-medium">
            ABOVE THRESHOLD
          </span>
        )}
      </div>
      <div className="text-[10px] text-slate-500 mt-0.5">
        Threshold: {threshold.toFixed(2)}
      </div>
    </div>
  );
}

export default function TriggerTimeline({
  trigger,
  onClose,
}: TriggerTimelineProps) {
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  const chartData: ChartDataPoint[] = trigger.activationHistory.map(
    (point) => ({
      date: new Date(point.date).toLocaleDateString("en-GB", {
        month: "short",
        day: "numeric",
      }),
      value: point.value,
      isActivation: point.value >= trigger.threshold,
    })
  );

  // Find activations (where value crosses threshold)
  const activations = trigger.activationHistory.filter(
    (point) => point.value >= trigger.threshold
  );

  // Calculate statistics
  const values = trigger.activationHistory.map((p) => p.value);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const latestValue = values[values.length - 1];
  const prevValue = values.length > 1 ? values[values.length - 2] : latestValue;
  const changePercent =
    prevValue !== 0 ? ((latestValue - prevValue) / prevValue) * 100 : 0;

  // Determine Y-axis domain
  const yMin = Math.max(0, Math.floor(minValue * 10) / 10 - 0.1);
  const yMax = Math.min(1, Math.ceil(maxValue * 10) / 10 + 0.1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-700/50 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-700/50 bg-slate-900/95 backdrop-blur-sm px-6 py-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
                  trigger.status === "red"
                    ? "bg-red-500/15 text-red-400 border-red-500/30"
                    : trigger.status === "amber"
                    ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                    : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                )}
              >
                {trigger.status === "red" && <Zap className="h-3 w-3" />}
                {trigger.status === "amber" && (
                  <AlertTriangle className="h-3 w-3" />
                )}
                {trigger.status === "red"
                  ? "ACTIVATED"
                  : trigger.status === "amber"
                  ? "WARNING"
                  : "NORMAL"}
              </span>
              <span className="text-xs text-slate-400">
                {trigger.organization}
              </span>
            </div>
            <h2 className="text-lg font-semibold text-slate-100">
              {trigger.name}
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              {trigger.metric} -- {trigger.country}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-6 py-4">
          <div className="rounded-lg border border-slate-700/40 bg-slate-800/50 px-3 py-2.5">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">
              Current
            </div>
            <div
              className={cn(
                "text-xl font-bold tabular-nums mt-0.5",
                trigger.status === "red"
                  ? "text-red-400"
                  : trigger.status === "amber"
                  ? "text-amber-400"
                  : "text-emerald-400"
              )}
            >
              {latestValue.toFixed(3)}
            </div>
          </div>
          <div className="rounded-lg border border-slate-700/40 bg-slate-800/50 px-3 py-2.5">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">
              Change
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              {changePercent > 0 ? (
                <ArrowUpRight className="h-4 w-4 text-red-400" />
              ) : changePercent < 0 ? (
                <ArrowDownRight className="h-4 w-4 text-emerald-400" />
              ) : null}
              <span
                className={cn(
                  "text-xl font-bold tabular-nums",
                  changePercent > 0
                    ? "text-red-400"
                    : changePercent < 0
                    ? "text-emerald-400"
                    : "text-slate-300"
                )}
              >
                {changePercent > 0 ? "+" : ""}
                {changePercent.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="rounded-lg border border-slate-700/40 bg-slate-800/50 px-3 py-2.5">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">
              Peak
            </div>
            <div className="text-xl font-bold tabular-nums text-slate-200 mt-0.5">
              {maxValue.toFixed(3)}
            </div>
          </div>
          <div className="rounded-lg border border-slate-700/40 bg-slate-800/50 px-3 py-2.5">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">
              Activations
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xl font-bold tabular-nums text-slate-200">
                {activations.length}
              </span>
              {activations.length > 0 && (
                <Zap className="h-4 w-4 text-red-400" />
              )}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="px-6 pb-4">
          <div className="rounded-xl border border-slate-700/40 bg-slate-800/30 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-slate-400" />
                Value Over Time
              </h3>
              <div className="flex items-center gap-4 text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="h-0.5 w-4 bg-slate-500 inline-block" style={{ borderTop: "2px dashed #64748b" }} />
                  Threshold ({trigger.threshold.toFixed(2)})
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-500 inline-block" />
                  Activation
                </span>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(100,116,139,0.15)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickLine={false}
                    axisLine={{ stroke: "rgba(100,116,139,0.2)" }}
                  />
                  <YAxis
                    domain={[yMin, yMax]}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v: number) => v.toFixed(2)}
                  />
                  <Tooltip
                    content={
                      <CustomTooltip threshold={trigger.threshold} />
                    }
                  />

                  {/* Color zones */}
                  <ReferenceArea
                    y1={trigger.threshold}
                    y2={yMax}
                    fill="rgba(239, 68, 68, 0.06)"
                    fillOpacity={1}
                  />
                  <ReferenceArea
                    y1={trigger.threshold * 0.85}
                    y2={trigger.threshold}
                    fill="rgba(245, 158, 11, 0.04)"
                    fillOpacity={1}
                  />
                  <ReferenceArea
                    y1={yMin}
                    y2={trigger.threshold * 0.85}
                    fill="rgba(16, 185, 129, 0.03)"
                    fillOpacity={1}
                  />

                  {/* Threshold line */}
                  <ReferenceLine
                    y={trigger.threshold}
                    stroke="#ef4444"
                    strokeDasharray="6 4"
                    strokeWidth={1.5}
                    label={{
                      value: `Threshold: ${trigger.threshold.toFixed(2)}`,
                      position: "insideTopRight",
                      fill: "#ef4444",
                      fontSize: 10,
                    }}
                  />

                  {/* Data line */}
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={
                      trigger.status === "red"
                        ? "#ef4444"
                        : trigger.status === "amber"
                        ? "#f59e0b"
                        : "#10b981"
                    }
                    strokeWidth={2.5}
                    dot={
                      <ActivationDot threshold={trigger.threshold} />
                    }
                    activeDot={{
                      r: 5,
                      stroke:
                        trigger.status === "red"
                          ? "#ef4444"
                          : trigger.status === "amber"
                          ? "#f59e0b"
                          : "#10b981",
                      strokeWidth: 2,
                      fill: "#0f172a",
                    }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Data table */}
        <div className="px-6 pb-6">
          <div className="rounded-xl border border-slate-700/40 bg-slate-800/30 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/40">
              <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-400" />
                Historical Values
              </h3>
              <span className="text-[11px] text-slate-500">
                {trigger.activationHistory.length} data points
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/40 bg-slate-800/50">
                    <th className="px-4 py-2.5 text-left text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                      Delta
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[...trigger.activationHistory]
                    .reverse()
                    .map((point, idx, arr) => {
                      const isAbove = point.value >= trigger.threshold;
                      const isNearThreshold =
                        !isAbove &&
                        point.value >= trigger.threshold * 0.85;
                      const prevPoint = arr[idx + 1];
                      const delta = prevPoint
                        ? point.value - prevPoint.value
                        : 0;

                      return (
                        <tr
                          key={point.date}
                          className={cn(
                            "border-b border-slate-700/20 transition-colors cursor-pointer",
                            selectedRow === idx
                              ? "bg-slate-700/30"
                              : "hover:bg-slate-700/20",
                            isAbove && "bg-red-500/5"
                          )}
                          onClick={() =>
                            setSelectedRow(
                              selectedRow === idx ? null : idx
                            )
                          }
                        >
                          <td className="px-4 py-2.5 text-slate-300 tabular-nums">
                            {new Date(point.date).toLocaleDateString(
                              "en-GB",
                              {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </td>
                          <td
                            className={cn(
                              "px-4 py-2.5 font-mono font-medium tabular-nums",
                              isAbove
                                ? "text-red-400"
                                : isNearThreshold
                                ? "text-amber-400"
                                : "text-slate-200"
                            )}
                          >
                            {point.value.toFixed(3)}
                          </td>
                          <td className="px-4 py-2.5">
                            {isAbove ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 border border-red-500/30 px-2 py-0.5 text-[10px] font-semibold text-red-400 uppercase tracking-wider">
                                <Zap className="h-2.5 w-2.5" />
                                Activated
                              </span>
                            ) : isNearThreshold ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-semibold text-amber-400 uppercase tracking-wider">
                                <AlertTriangle className="h-2.5 w-2.5" />
                                Warning
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                                Normal
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-2.5">
                            {prevPoint ? (
                              <span
                                className={cn(
                                  "flex items-center gap-0.5 text-xs font-medium tabular-nums",
                                  delta > 0
                                    ? "text-red-400"
                                    : delta < 0
                                    ? "text-emerald-400"
                                    : "text-slate-500"
                                )}
                              >
                                {delta > 0 ? (
                                  <ArrowUpRight className="h-3 w-3" />
                                ) : delta < 0 ? (
                                  <ArrowDownRight className="h-3 w-3" />
                                ) : null}
                                {delta > 0 ? "+" : ""}
                                {delta.toFixed(3)}
                              </span>
                            ) : (
                              <span className="text-xs text-slate-600">
                                --
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
