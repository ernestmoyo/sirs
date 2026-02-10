"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { useSidebar } from "./AppShell";
import {
  LayoutDashboard,
  ShieldAlert,
  Layers,
  Bell,
  LayoutGrid,
  ClipboardList,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity,
  Radio,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Risk Monitor", href: "/risk-monitor", icon: ShieldAlert },
  { label: "Scenarios", href: "/scenarios", icon: Layers },
  { label: "Triggers", href: "/triggers", icon: Bell, badge: 3 },
  { label: "Sector Lenses", href: "/sectors", icon: LayoutGrid },
  { label: "Data Collection", href: "/data-collection", icon: ClipboardList },
  { label: "Collaboration", href: "/collaboration", icon: Users },
];

const bottomNavItems: NavItem[] = [
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useSidebar();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo Area */}
      <div
        className={clsx(
          "flex items-center border-b border-slate-700/50 px-4",
          collapsed ? "h-16 justify-center" : "h-16 gap-3"
        )}
      >
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20">
          <Activity className="h-5 w-5 text-white" strokeWidth={2.5} />
          <div className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-900 bg-emerald-400" />
        </div>
        {!collapsed && (
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold tracking-wide text-slate-100">
              SIRS
            </span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-slate-500">
              7Square
            </span>
          </div>
        )}
      </div>

      {/* Active Events Indicator */}
      <div
        className={clsx(
          "mx-3 mt-4 mb-2 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2.5",
          collapsed && "mx-2 px-2"
        )}
      >
        {collapsed ? (
          <div className="flex justify-center">
            <div className="relative">
              <Radio className="h-4 w-4 text-red-400" />
              <div className="absolute -right-1 -top-1 h-2 w-2 animate-pulse rounded-full bg-red-500" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Radio className="h-4 w-4 text-red-400" />
              <div className="absolute -right-0.5 -top-0.5 h-2 w-2 animate-pulse rounded-full bg-red-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-red-300">
                4 Active Events
              </span>
              <span className="text-[10px] text-slate-500">
                2 critical, 1 high, 1 moderate
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Label */}
      {!collapsed && (
        <div className="px-4 pt-4 pb-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">
            Navigation
          </span>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 pt-1">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "group relative flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                collapsed && "justify-center px-2",
                active
                  ? "bg-blue-500/10 text-blue-400"
                  : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
              )}
            >
              {/* Active indicator bar */}
              {active && (
                <div className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              )}

              <item.icon
                className={clsx(
                  "h-[18px] w-[18px] shrink-0 transition-colors duration-200",
                  active
                    ? "text-blue-400"
                    : "text-slate-500 group-hover:text-slate-300"
                )}
              />

              {!collapsed && (
                <>
                  <span className="ml-3">{item.label}</span>

                  {/* Badge */}
                  {item.badge && (
                    <span
                      className={clsx(
                        "ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold",
                        active
                          ? "bg-blue-500/20 text-blue-300"
                          : "bg-slate-700/80 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-300"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}

              {/* Collapsed tooltip */}
              {collapsed && (
                <div className="pointer-events-none absolute left-full z-50 ml-2 whitespace-nowrap rounded-md bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-200 opacity-0 shadow-xl ring-1 ring-slate-700/50 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100">
                  {item.label}
                  {item.badge && (
                    <span className="ml-1.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-blue-500/20 px-1 text-[10px] text-blue-300">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-slate-700/50 px-2 pt-2 pb-2">
        {/* Settings */}
        {bottomNavItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "group relative flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                collapsed && "justify-center px-2",
                active
                  ? "bg-blue-500/10 text-blue-400"
                  : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
              )}
            >
              <item.icon
                className={clsx(
                  "h-[18px] w-[18px] shrink-0 transition-colors duration-200",
                  active
                    ? "text-blue-400"
                    : "text-slate-500 group-hover:text-slate-300"
                )}
              />
              {!collapsed && <span className="ml-3">{item.label}</span>}
              {collapsed && (
                <div className="pointer-events-none absolute left-full z-50 ml-2 whitespace-nowrap rounded-md bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-200 opacity-0 shadow-xl ring-1 ring-slate-700/50 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}

        {/* User Area */}
        <div
          className={clsx(
            "mt-2 flex items-center rounded-lg border border-slate-700/50 bg-slate-800/30 px-3 py-2.5 transition-colors hover:border-slate-600/50 hover:bg-slate-800/60",
            collapsed && "justify-center px-2"
          )}
        >
          <div className="relative h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-blue-400 to-violet-500">
            <span className="flex h-full w-full items-center justify-center text-xs font-bold text-white">
              JM
            </span>
            <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-900 bg-emerald-400" />
          </div>
          {!collapsed && (
            <div className="ml-3 flex flex-col overflow-hidden">
              <span className="truncate text-sm font-medium text-slate-200">
                James Moyo
              </span>
              <span className="truncate text-[10px] text-slate-500">
                Regional Analyst
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden border-t border-slate-700/50 p-3 text-slate-500 transition-colors hover:bg-slate-800/50 hover:text-slate-300 lg:flex lg:items-center lg:justify-center"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-slate-300 shadow-lg ring-1 ring-slate-700/50 transition-colors hover:bg-slate-700 hover:text-white lg:hidden"
        aria-label="Open navigation"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-slate-900 transition-transform duration-300 ease-in-out lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={clsx(
          "sidebar-transition fixed inset-y-0 left-0 z-30 hidden border-r border-slate-700/50 bg-slate-900 lg:flex lg:flex-col",
          collapsed ? "w-[68px]" : "w-64"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
