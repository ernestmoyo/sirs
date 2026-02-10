"use client";

import {
  Users,
  AlertTriangle,
  Bell,
  ShieldAlert,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { sadcCountries, activeEvents, triggers } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";

interface KpiCard {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ReactNode;
  accentColor: string;
  borderColor: string;
  iconBg: string;
}

export default function RiskOverviewCards() {
  const totalAffected = sadcCountries.reduce(
    (sum, c) => sum + c.affectedPopulation,
    0
  );
  const activeEventCount = activeEvents.filter(
    (e) => e.status === "active"
  ).length;
  const triggeredAlerts = triggers.filter((t) => t.status === "red").length;
  const highRiskCountries = sadcCountries.filter(
    (c) => c.riskScore >= 0.6
  ).length;

  const cards: KpiCard[] = [
    {
      title: "Total Affected Population",
      value: formatNumber(totalAffected),
      change: 12.4,
      changeLabel: "vs last week",
      icon: <Users className="h-5 w-5" />,
      accentColor: "text-blue-400",
      borderColor: "border-blue-500/30",
      iconBg: "bg-blue-500/15",
    },
    {
      title: "Active Events",
      value: activeEventCount.toString(),
      change: 2,
      changeLabel: "new this week",
      icon: <AlertTriangle className="h-5 w-5" />,
      accentColor: "text-amber-400",
      borderColor: "border-amber-500/30",
      iconBg: "bg-amber-500/15",
    },
    {
      title: "Triggered Alerts",
      value: triggeredAlerts.toString(),
      change: 1,
      changeLabel: "new today",
      icon: <Bell className="h-5 w-5" />,
      accentColor: "text-red-400",
      borderColor: "border-red-500/30",
      iconBg: "bg-red-500/15",
    },
    {
      title: "Countries at High Risk",
      value: highRiskCountries.toString(),
      change: -1,
      changeLabel: "vs last week",
      icon: <ShieldAlert className="h-5 w-5" />,
      accentColor: "text-orange-400",
      borderColor: "border-orange-500/30",
      iconBg: "bg-orange-500/15",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`relative overflow-hidden rounded-xl border ${card.borderColor} bg-slate-800/50 backdrop-blur-sm p-5 transition-all duration-200 hover:bg-slate-800/70`}
        >
          {/* Subtle gradient overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent" />

          <div className="relative flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                {card.title}
              </p>
              <p className={`mt-2 text-3xl font-bold ${card.accentColor}`}>
                {card.value}
              </p>
              <div className="mt-2 flex items-center gap-1.5">
                {card.change > 0 ? (
                  <TrendingUp className="h-3.5 w-3.5 text-red-400" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5 text-emerald-400" />
                )}
                <span
                  className={`text-xs font-medium ${
                    card.change > 0 ? "text-red-400" : "text-emerald-400"
                  }`}
                >
                  {card.change > 0 ? "+" : ""}
                  {card.change}
                  {card.title === "Total Affected Population" ? "%" : ""}
                </span>
                <span className="text-xs text-slate-500">
                  {card.changeLabel}
                </span>
              </div>
            </div>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.iconBg} ${card.accentColor}`}
            >
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
