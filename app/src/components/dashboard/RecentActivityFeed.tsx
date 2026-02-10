"use client";

import {
  Activity,
  Bell,
  FileCheck,
  Megaphone,
  Database,
  Zap,
} from "lucide-react";
import { recentActivities } from "@/lib/mock-data";

const ACTIVITY_CONFIG: Record<
  string,
  { icon: React.ReactNode; color: string; lineColor: string }
> = {
  scenario: {
    icon: <Zap className="h-3.5 w-3.5" />,
    color: "text-purple-400 bg-purple-500/15",
    lineColor: "bg-purple-500/40",
  },
  trigger: {
    icon: <Bell className="h-3.5 w-3.5" />,
    color: "text-red-400 bg-red-500/15",
    lineColor: "bg-red-500/40",
  },
  assessment: {
    icon: <FileCheck className="h-3.5 w-3.5" />,
    color: "text-blue-400 bg-blue-500/15",
    lineColor: "bg-blue-500/40",
  },
  advisory: {
    icon: <Megaphone className="h-3.5 w-3.5" />,
    color: "text-amber-400 bg-amber-500/15",
    lineColor: "bg-amber-500/40",
  },
  data: {
    icon: <Database className="h-3.5 w-3.5" />,
    color: "text-emerald-400 bg-emerald-500/15",
    lineColor: "bg-emerald-500/40",
  },
};

export default function RecentActivityFeed() {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">
            Recent Activity
          </h3>
          <p className="text-xs text-slate-500">Latest platform actions</p>
        </div>
        <Activity className="h-4 w-4 text-slate-500" />
      </div>

      <div className="relative">
        {recentActivities.map((activity, index) => {
          const config = ACTIVITY_CONFIG[activity.type] || ACTIVITY_CONFIG.data;
          const isLast = index === recentActivities.length - 1;

          return (
            <div key={activity.id} className="relative flex gap-3 pb-4">
              {/* Timeline line */}
              {!isLast && (
                <div
                  className={`absolute left-[13px] top-8 h-[calc(100%-16px)] w-px ${config.lineColor}`}
                />
              )}

              {/* Icon */}
              <div
                className={`relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${config.color}`}
              >
                {config.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-xs font-medium text-slate-200">
                  {activity.action}
                </p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-slate-400 truncate">
                  {activity.detail}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-[10px] text-slate-500">
                    {activity.user}
                  </span>
                  <span className="text-[10px] text-slate-600">
                    &middot;
                  </span>
                  <span className="text-[10px] text-slate-600">
                    {activity.time}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
