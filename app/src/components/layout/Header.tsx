"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  Search,
  Bell,
  ChevronDown,
  Clock,
  AlertTriangle,
  CloudRain,
  Flame,
  Wind,
  LogOut,
  User,
  Settings,
  HelpCircle,
  X,
} from "lucide-react";
import { clsx } from "clsx";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/risk-monitor": "Risk Monitor",
  "/scenarios": "Scenarios",
  "/triggers": "Triggers",
  "/sectors": "Sector Lenses",
  "/data-collection": "Data Collection",
  "/collaboration": "Collaboration",
  "/settings": "Settings",
};

const pageDescriptions: Record<string, string> = {
  "/": "Regional risk overview and operational status",
  "/risk-monitor": "Real-time hazard monitoring and early warnings",
  "/scenarios": "Impact scenario modeling and analysis",
  "/triggers": "Pre-agreed trigger thresholds and activations",
  "/sectors": "Sector-specific vulnerability assessment",
  "/data-collection": "Field data collection and management",
  "/collaboration": "Multi-stakeholder coordination hub",
  "/settings": "Platform configuration and preferences",
};

interface Alert {
  id: string;
  type: "critical" | "high" | "moderate" | "info";
  title: string;
  location: string;
  time: string;
  icon: React.ComponentType<{ className?: string }>;
}

const recentAlerts: Alert[] = [
  {
    id: "1",
    type: "critical",
    title: "Tropical Cyclone Freddy",
    location: "Mozambique, Malawi",
    time: "12 min ago",
    icon: Wind,
  },
  {
    id: "2",
    type: "high",
    title: "Flood Warning - Limpopo Basin",
    location: "South Africa, Mozambique",
    time: "1h ago",
    icon: CloudRain,
  },
  {
    id: "3",
    type: "moderate",
    title: "Drought Escalation",
    location: "Zimbabwe, Zambia",
    time: "3h ago",
    icon: Flame,
  },
  {
    id: "4",
    type: "info",
    title: "Seismic Activity Detected",
    location: "Tanzania",
    time: "5h ago",
    icon: AlertTriangle,
  },
];

const alertColors = {
  critical: "bg-red-500/10 border-red-500/30 text-red-400",
  high: "bg-orange-500/10 border-orange-500/30 text-orange-400",
  moderate: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
  info: "bg-blue-500/10 border-blue-500/30 text-blue-400",
};

const alertDotColors = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  moderate: "bg-yellow-500",
  info: "bg-blue-500",
};

export default function Header({ collapsed }: { collapsed?: boolean }) {
  const pathname = usePathname();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAlerts, setShowAlerts] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const alertsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const title = pageTitles[pathname] || "Dashboard";
  const description = pageDescriptions[pathname] || "";

  // Update timestamp
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLastUpdated(
        now.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }) +
          " UTC+" +
          String(Math.abs(now.getTimezoneOffset() / 60)).padStart(1, "0")
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        alertsRef.current &&
        !alertsRef.current.contains(e.target as Node)
      ) {
        setShowAlerts(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-700/50 bg-slate-950/80 px-4 backdrop-blur-xl sm:px-6">
      {/* Left: Title */}
      <div className="flex min-w-0 flex-col pl-12 lg:pl-0">
        <h1 className="truncate text-lg font-semibold text-slate-100">
          {title}
        </h1>
        <p className="hidden truncate text-xs text-slate-500 sm:block">
          {description}
        </p>
      </div>

      {/* Center: Search Bar */}
      <div className="mx-4 hidden max-w-md flex-1 md:block">
        <div
          className={clsx(
            "relative flex items-center rounded-lg border bg-slate-800/50 transition-all duration-200",
            searchFocused
              ? "border-blue-500/50 ring-1 ring-blue-500/20"
              : "border-slate-700/50 hover:border-slate-600/50"
          )}
        >
          <Search className="ml-3 h-4 w-4 shrink-0 text-slate-500" />
          <input
            type="text"
            placeholder="Search events, regions, indicators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full bg-transparent px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="mr-2 rounded p-0.5 text-slate-500 hover:text-slate-300"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <kbd className="mr-3 hidden rounded border border-slate-600/50 bg-slate-700/50 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 lg:inline-block">
            Ctrl+K
          </kbd>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Last Updated */}
        <div className="mr-1 hidden items-center gap-1.5 rounded-lg border border-slate-700/50 bg-slate-800/30 px-2.5 py-1.5 xl:flex">
          <Clock className="h-3 w-3 text-emerald-400" />
          <span className="text-[11px] font-medium text-slate-400">
            {lastUpdated}
          </span>
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
        </div>

        {/* Mobile Search Toggle */}
        <button className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200 md:hidden">
          <Search className="h-[18px] w-[18px]" />
        </button>

        {/* Notifications */}
        <div ref={alertsRef} className="relative">
          <button
            onClick={() => {
              setShowAlerts(!showAlerts);
              setShowProfile(false);
            }}
            className={clsx(
              "relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
              showAlerts
                ? "bg-slate-800 text-slate-200"
                : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            )}
          >
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute right-1 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-lg shadow-red-500/30">
              4
            </span>
          </button>

          {/* Alerts Dropdown */}
          {showAlerts && (
            <div className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-xl border border-slate-700/50 bg-slate-900 shadow-2xl shadow-black/50 sm:w-96">
              <div className="flex items-center justify-between border-b border-slate-700/50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-200">
                    Active Alerts
                  </h3>
                  <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-400">
                    4 NEW
                  </span>
                </div>
                <button className="text-xs font-medium text-blue-400 transition-colors hover:text-blue-300">
                  View all
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {recentAlerts.map((alert) => (
                  <button
                    key={alert.id}
                    className="flex w-full items-start gap-3 border-b border-slate-800/50 px-4 py-3 text-left transition-colors hover:bg-slate-800/40"
                  >
                    <div
                      className={clsx(
                        "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
                        alertColors[alert.type]
                      )}
                    >
                      <alert.icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <div
                          className={clsx(
                            "h-1.5 w-1.5 shrink-0 rounded-full",
                            alertDotColors[alert.type]
                          )}
                        />
                        <span className="truncate text-sm font-medium text-slate-200">
                          {alert.title}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {alert.location}
                      </p>
                    </div>
                    <span className="shrink-0 text-[10px] text-slate-600">
                      {alert.time}
                    </span>
                  </button>
                ))}
              </div>

              <div className="border-t border-slate-700/50 px-4 py-2.5">
                <button className="w-full rounded-lg bg-slate-800/50 py-2 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200">
                  Open Notifications Center
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="hidden h-6 w-px bg-slate-700/50 sm:block" />

        {/* User Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowAlerts(false);
            }}
            className={clsx(
              "flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors",
              showProfile
                ? "bg-slate-800"
                : "hover:bg-slate-800/60"
            )}
          >
            <div className="relative h-7 w-7 rounded-full bg-gradient-to-br from-blue-400 to-violet-500">
              <span className="flex h-full w-full items-center justify-center text-[10px] font-bold text-white">
                JM
              </span>
              <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border-[1.5px] border-slate-950 bg-emerald-400" />
            </div>
            <div className="hidden flex-col items-start sm:flex">
              <span className="text-xs font-medium text-slate-200">
                James Moyo
              </span>
              <span className="text-[10px] text-slate-500">SADC HQ</span>
            </div>
            <ChevronDown className="hidden h-3.5 w-3.5 text-slate-500 sm:block" />
          </button>

          {/* Profile Dropdown */}
          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-slate-700/50 bg-slate-900 shadow-2xl shadow-black/50">
              <div className="border-b border-slate-700/50 px-4 py-3">
                <p className="text-sm font-medium text-slate-200">
                  James Moyo
                </p>
                <p className="text-xs text-slate-500">
                  j.moyo@sadc.int
                </p>
                <div className="mt-2 flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[10px] font-medium text-emerald-400">
                    Online
                  </span>
                  <span className="text-[10px] text-slate-600">
                    -- Regional Analyst
                  </span>
                </div>
              </div>

              <div className="py-1">
                <button className="flex w-full items-center gap-3 px-4 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-800/60 hover:text-slate-200">
                  <User className="h-4 w-4" />
                  Profile
                </button>
                <button className="flex w-full items-center gap-3 px-4 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-800/60 hover:text-slate-200">
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
                <button className="flex w-full items-center gap-3 px-4 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-800/60 hover:text-slate-200">
                  <HelpCircle className="h-4 w-4" />
                  Help & Support
                </button>
              </div>

              <div className="border-t border-slate-700/50 py-1">
                <button className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/5 hover:text-red-300">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
