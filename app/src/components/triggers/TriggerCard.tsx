"use client";

import { useState } from "react";
import {
  Settings2,
  History,
  CheckCircle2,
  Building2,
  MapPin,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Zap,
} from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  YAxis,
  ReferenceLine,
} from "recharts";
import type { TriggerConfig } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface TriggerCardProps {
  trigger: TriggerConfig;
  onConfigure?: (trigger: TriggerConfig) => void;
  onHistory?: (trigger: TriggerConfig) => void;
  onAcknowledge?: (trigger: TriggerConfig) => void;
}

const statusConfig = {
  red: {
    label: "ACTIVATED",
    bg: "bg-red-500",
    glow: "shadow-[0_0_20px_rgba(239,68,68,0.5)]",
    border: "border-red-500/40",
    text: "text-red-400",
    badgeBg: "bg-red-500/15",
    badgeBorder: "border-red-500/30",
    pulseClass: "animate-pulse-red",
    glowClass: "animate-glow-red",
    cardBorder: "border-red-500/20 hover:border-red-500/40",
    cardGlow: "hover:shadow-[0_0_30px_rgba(239,68,68,0.15)]",
    progressBg: "bg-red-500",
    progressTrack: "bg-red-500/10",
    sparkColor: "#ef4444",
    icon: Zap,
  },
  amber: {
    label: "WARNING",
    bg: "bg-amber-500",
    glow: "shadow-[0_0_15px_rgba(245,158,11,0.4)]",
    border: "border-amber-500/40",
    text: "text-amber-400",
    badgeBg: "bg-amber-500/15",
    badgeBorder: "border-amber-500/30",
    pulseClass: "animate-pulse-amber",
    glowClass: "animate-glow-amber",
    cardBorder: "border-amber-500/20 hover:border-amber-500/40",
    cardGlow: "hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]",
    progressBg: "bg-amber-500",
    progressTrack: "bg-amber-500/10",
    sparkColor: "#f59e0b",
    icon: AlertTriangle,
  },
  green: {
    label: "NORMAL",
    bg: "bg-emerald-500",
    glow: "shadow-[0_0_10px_rgba(16,185,129,0.3)]",
    border: "border-emerald-500/40",
    text: "text-emerald-400",
    badgeBg: "bg-emerald-500/15",
    badgeBorder: "border-emerald-500/30",
    pulseClass: "",
    glowClass: "",
    cardBorder: "border-slate-700/50 hover:border-emerald-500/30",
    cardGlow: "hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]",
    progressBg: "bg-emerald-500",
    progressTrack: "bg-emerald-500/10",
    sparkColor: "#10b981",
    icon: CheckCircle2,
  },
};

function getRelativeTime(isoString: string): string {
  const now = new Date();
  const date = new Date(isoString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function getTrend(
  history: { date: string; value: number }[]
): "up" | "down" | "flat" {
  if (history.length < 2) return "flat";
  const last = history[history.length - 1].value;
  const prev = history[history.length - 2].value;
  const diff = last - prev;
  if (diff > 0.02) return "up";
  if (diff < -0.02) return "down";
  return "flat";
}

export default function TriggerCard({
  trigger,
  onConfigure,
  onHistory,
  onAcknowledge,
}: TriggerCardProps) {
  const [acknowledged, setAcknowledged] = useState(false);
  const config = statusConfig[trigger.status];
  const StatusIcon = config.icon;
  const trend = getTrend(trigger.activationHistory);
  const progressPercent = Math.min(
    (trigger.currentValue / trigger.threshold) * 100,
    150
  );
  const displayPercent = Math.min(progressPercent, 100);

  const sparkData = trigger.activationHistory.map((point) => ({
    value: point.value,
    date: point.date,
  }));

  const handleAcknowledge = () => {
    setAcknowledged(true);
    onAcknowledge?.(trigger);
  };

  return (
    <div
      className={cn(
        "relative rounded-xl border bg-slate-800/50 backdrop-blur-sm p-5 transition-all duration-300",
        config.cardBorder,
        config.cardGlow,
        trigger.status === "red" && "bg-slate-800/70"
      )}
    >
      {/* Top row: status indicator + org badge + trigger name */}
      <div className="flex items-start gap-4">
        {/* Large status indicator */}
        <div className="relative flex-shrink-0 pt-0.5">
          <div
            className={cn(
              "h-5 w-5 rounded-full",
              config.bg,
              trigger.status === "red" && config.pulseClass,
              trigger.status === "amber" && config.pulseClass
            )}
          />
          {/* Outer glow ring for red */}
          {trigger.status === "red" && (
            <div className="absolute inset-0 h-5 w-5 rounded-full bg-red-500/20 animate-ping" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Org + Country row */}
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
                config.badgeBg,
                config.badgeBorder,
                config.text
              )}
            >
              <StatusIcon className="h-3 w-3" />
              {config.label}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md border border-slate-600/30 bg-slate-700/40 px-2 py-0.5 text-[11px] font-medium text-slate-300">
              <Building2 className="h-3 w-3 text-slate-400" />
              {trigger.organization}
            </span>
          </div>

          {/* Trigger name */}
          <h3 className="text-sm font-semibold text-slate-100 leading-tight truncate">
            {trigger.name}
          </h3>

          {/* Country + metric */}
          <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {trigger.country}
            </span>
            <span className="text-slate-600">|</span>
            <span className="truncate">{trigger.metric}</span>
          </div>
        </div>
      </div>

      {/* Value vs Threshold section */}
      <div className="mt-4">
        <div className="flex items-end justify-between mb-2">
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-0.5">
              Current Value
            </div>
            <div className="flex items-baseline gap-2">
              <span
                className={cn(
                  "text-2xl font-bold tabular-nums",
                  trigger.status === "red"
                    ? "text-red-400"
                    : trigger.status === "amber"
                    ? "text-amber-400"
                    : "text-emerald-400"
                )}
              >
                {trigger.currentValue.toFixed(2)}
              </span>
              <span className="text-xs text-slate-500">
                / {trigger.threshold.toFixed(2)} threshold
              </span>
            </div>
          </div>

          {/* Trend indicator */}
          <div className="flex items-center gap-1">
            {trend === "up" && (
              <TrendingUp
                className={cn(
                  "h-4 w-4",
                  trigger.currentValue > trigger.threshold
                    ? "text-red-400"
                    : "text-amber-400"
                )}
              />
            )}
            {trend === "down" && (
              <TrendingDown className="h-4 w-4 text-emerald-400" />
            )}
            {trend === "flat" && (
              <Minus className="h-4 w-4 text-slate-500" />
            )}
            <span
              className={cn(
                "text-xs font-medium",
                trend === "up" && trigger.currentValue > trigger.threshold
                  ? "text-red-400"
                  : trend === "up"
                  ? "text-amber-400"
                  : trend === "down"
                  ? "text-emerald-400"
                  : "text-slate-500"
              )}
            >
              {trend === "up"
                ? "Rising"
                : trend === "down"
                ? "Falling"
                : "Stable"}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative">
          <div
            className={cn(
              "h-2 rounded-full overflow-hidden",
              config.progressTrack
            )}
          >
            <div
              className={cn(
                "h-full rounded-full transition-all duration-700 ease-out",
                config.progressBg,
                trigger.status === "red" && "opacity-90"
              )}
              style={{ width: `${displayPercent}%` }}
            />
          </div>
          {/* Threshold marker */}
          {progressPercent > 100 && (
            <div
              className="absolute top-0 h-2 w-0.5 bg-white/60"
              style={{
                left: `${(trigger.threshold / trigger.currentValue) * 100}%`,
              }}
            />
          )}
        </div>

        {/* Percentage label */}
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-slate-500">0</span>
          <span
            className={cn(
              "text-[10px] font-medium",
              progressPercent >= 100 ? config.text : "text-slate-400"
            )}
          >
            {Math.round(progressPercent)}% of threshold
          </span>
          <span className="text-[10px] text-slate-500">
            {trigger.threshold.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Sparkline */}
      <div className="mt-3 h-12 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparkData}>
            <YAxis domain={[0, 1]} hide />
            <ReferenceLine
              y={trigger.threshold}
              stroke="#64748b"
              strokeDasharray="3 3"
              strokeWidth={1}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={config.sparkColor}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer: timestamp + actions */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700/50">
        <div className="flex items-center gap-1 text-[11px] text-slate-500">
          <Clock className="h-3 w-3" />
          <span>Updated {getRelativeTime(trigger.lastUpdated)}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onConfigure?.(trigger)}
            className="rounded-md p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-colors"
            title="Configure trigger"
          >
            <Settings2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onHistory?.(trigger)}
            className="rounded-md p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-colors"
            title="View history"
          >
            <History className="h-3.5 w-3.5" />
          </button>
          {trigger.status === "red" && !acknowledged && (
            <button
              onClick={handleAcknowledge}
              className="rounded-md px-2.5 py-1 text-[11px] font-medium bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25 transition-colors"
              title="Acknowledge trigger"
            >
              Acknowledge
            </button>
          )}
          {trigger.status === "red" && acknowledged && (
            <span className="flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle2 className="h-3 w-3" />
              Ack&apos;d
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
