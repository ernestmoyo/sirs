"use client";

import { useState } from "react";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import {
  Settings,
  User,
  Bell,
  Mail,
  Smartphone,
  LayoutDashboard,
  Database,
  Globe,
  Moon,
  Sun,
  Monitor,
  Languages,
  Info,
  Shield,
  Save,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  Wifi,
  WifiOff,
  Clock,
  Activity,
} from "lucide-react";

// -- Mock data source endpoints --
interface DataSource {
  id: string;
  name: string;
  endpoint: string;
  status: "connected" | "disconnected" | "degraded";
  lastSync: string;
  type: string;
}

const dataSources: DataSource[] = [
  { id: "ds-1", name: "INFORM Risk Index", endpoint: "https://drmkc.jrc.ec.europa.eu/inform-index/API/v1", status: "connected", lastSync: "2026-02-10 08:00", type: "Risk Data" },
  { id: "ds-2", name: "KoboToolbox", endpoint: "https://kobo.humanitarianresponse.info/api/v2", status: "connected", lastSync: "2026-02-10 07:45", type: "Assessments" },
  { id: "ds-3", name: "RSMC La Reunion", endpoint: "https://www.meteo.fr/temps/domaine/CMRS/api", status: "connected", lastSync: "2026-02-10 06:30", type: "Weather" },
  { id: "ds-4", name: "GloFAS", endpoint: "https://cds.climate.copernicus.eu/api/v2", status: "degraded", lastSync: "2026-02-10 04:00", type: "Flood Forecast" },
  { id: "ds-5", name: "FEWS NET", endpoint: "https://fews.net/api/v1", status: "connected", lastSync: "2026-02-09 18:00", type: "Food Security" },
  { id: "ds-6", name: "HDX OCHA", endpoint: "https://data.humdata.org/api/3", status: "connected", lastSync: "2026-02-10 05:15", type: "Humanitarian Data" },
  { id: "ds-7", name: "Copernicus EMS", endpoint: "https://emergency.copernicus.eu/api/v1", status: "disconnected", lastSync: "2026-02-08 12:00", type: "Satellite Imagery" },
  { id: "ds-8", name: "SADC HYCOS", endpoint: "https://sadc-hycos.org/api/v2", status: "connected", lastSync: "2026-02-10 07:00", type: "Hydrology" },
];

const languages = [
  { code: "en", name: "English" },
  { code: "pt", name: "Portuguese" },
  { code: "fr", name: "French" },
  { code: "sw", name: "Swahili" },
];

export default function SettingsPage() {
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");
  const [language, setLanguage] = useState("en");
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    dashboard: true,
    triggerAlerts: true,
    dailyDigest: true,
    weeklyReport: false,
  });

  const connectedSources = dataSources.filter(
    (d) => d.status === "connected"
  ).length;

  return (
        <div className="space-y-6">
          {/* Page Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-100">Settings</h1>
              <p className="mt-1 text-sm text-slate-400">
                Manage your profile, notifications, and platform configuration
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              icon={<Save className="h-4 w-4" />}
            >
              Save Changes
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {/* Profile Settings */}
            <Card padding="md">
              <CardHeader>
                <CardTitle icon={<User className="h-4 w-4" />}>
                  Profile Settings
                </CardTitle>
              </CardHeader>

              <div className="space-y-4">
                {/* Avatar + Name */}
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 shrink-0 rounded-full bg-gradient-to-br from-blue-400 to-violet-500">
                    <span className="flex h-full w-full items-center justify-center text-lg font-bold text-white">
                      JM
                    </span>
                    <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-slate-800 bg-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-100">
                      James Moyo
                    </p>
                    <p className="text-xs text-slate-400">Regional Analyst</p>
                    <p className="text-xs text-slate-500">
                      james.moyo@sadc.int
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>

                {/* Form fields */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-400">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue="James Moyo"
                      className="w-full rounded-lg border border-slate-700/50 bg-slate-900/60 px-3 py-2 text-sm text-slate-200 outline-none transition-colors focus:border-blue-500/50"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-400">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="james.moyo@sadc.int"
                      className="w-full rounded-lg border border-slate-700/50 bg-slate-900/60 px-3 py-2 text-sm text-slate-200 outline-none transition-colors focus:border-blue-500/50"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-400">
                      Role
                    </label>
                    <input
                      type="text"
                      defaultValue="Regional Analyst"
                      className="w-full rounded-lg border border-slate-700/50 bg-slate-900/60 px-3 py-2 text-sm text-slate-200 outline-none transition-colors focus:border-blue-500/50"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-400">
                      Organization
                    </label>
                    <input
                      type="text"
                      defaultValue="SADC Secretariat"
                      className="w-full rounded-lg border border-slate-700/50 bg-slate-900/60 px-3 py-2 text-sm text-slate-200 outline-none transition-colors focus:border-blue-500/50"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-400">
                      Phone
                    </label>
                    <input
                      type="text"
                      defaultValue="+267 3951863"
                      className="w-full rounded-lg border border-slate-700/50 bg-slate-900/60 px-3 py-2 text-sm text-slate-200 outline-none transition-colors focus:border-blue-500/50"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-400">
                      Duty Station
                    </label>
                    <input
                      type="text"
                      defaultValue="Gaborone, Botswana"
                      className="w-full rounded-lg border border-slate-700/50 bg-slate-900/60 px-3 py-2 text-sm text-slate-200 outline-none transition-colors focus:border-blue-500/50"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Notification Preferences */}
            <Card padding="md">
              <CardHeader>
                <CardTitle icon={<Bell className="h-4 w-4" />}>
                  Notification Preferences
                </CardTitle>
              </CardHeader>

              <div className="space-y-4">
                {/* Channels */}
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Notification Channels
                  </p>
                  <div className="space-y-2.5">
                    {[
                      {
                        key: "email" as const,
                        label: "Email Notifications",
                        desc: "Receive alerts and reports via email",
                        icon: <Mail className="h-4 w-4" />,
                      },
                      {
                        key: "sms" as const,
                        label: "SMS Notifications",
                        desc: "Critical alerts sent via SMS",
                        icon: <Smartphone className="h-4 w-4" />,
                      },
                      {
                        key: "dashboard" as const,
                        label: "Dashboard Notifications",
                        desc: "In-app notification center",
                        icon: <LayoutDashboard className="h-4 w-4" />,
                      },
                    ].map((channel) => (
                      <div
                        key={channel.key}
                        className="flex items-center justify-between rounded-lg border border-slate-700/50 bg-slate-900/40 px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-400">
                            {channel.icon}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-slate-200">
                              {channel.label}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              {channel.desc}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            setNotifications((n) => ({
                              ...n,
                              [channel.key]: !n[channel.key],
                            }))
                          }
                          className={`relative h-6 w-11 rounded-full transition-colors ${
                            notifications[channel.key]
                              ? "bg-blue-600"
                              : "bg-slate-700"
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                              notifications[channel.key]
                                ? "translate-x-[22px]"
                                : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Alert Types */}
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Alert Types
                  </p>
                  <div className="space-y-2.5">
                    {[
                      {
                        key: "triggerAlerts" as const,
                        label: "Trigger Activations",
                        desc: "When a trigger threshold is breached",
                      },
                      {
                        key: "dailyDigest" as const,
                        label: "Daily Risk Digest",
                        desc: "Morning summary of regional risk status",
                      },
                      {
                        key: "weeklyReport" as const,
                        label: "Weekly Analytical Report",
                        desc: "Comprehensive weekly risk analysis",
                      },
                    ].map((alertType) => (
                      <div
                        key={alertType.key}
                        className="flex items-center justify-between rounded-lg border border-slate-700/50 bg-slate-900/40 px-4 py-3"
                      >
                        <div>
                          <p className="text-xs font-medium text-slate-200">
                            {alertType.label}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {alertType.desc}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            setNotifications((n) => ({
                              ...n,
                              [alertType.key]: !n[alertType.key],
                            }))
                          }
                          className={`relative h-6 w-11 rounded-full transition-colors ${
                            notifications[alertType.key]
                              ? "bg-blue-600"
                              : "bg-slate-700"
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                              notifications[alertType.key]
                                ? "translate-x-[22px]"
                                : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Data Source Configuration */}
            <Card padding="none" className="xl:col-span-2">
              <div className="border-b border-slate-700/50 p-5">
                <div className="flex items-center justify-between">
                  <CardTitle icon={<Database className="h-4 w-4" />}>
                    Data Source Configuration
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="success" dot>
                      {connectedSources}/{dataSources.length} connected
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<RefreshCw className="h-3.5 w-3.5" />}
                    >
                      Sync All
                    </Button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700/30">
                      <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        Source
                      </th>
                      <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        Endpoint
                      </th>
                      <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        Type
                      </th>
                      <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        Status
                      </th>
                      <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        Last Sync
                      </th>
                      <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/20">
                    {dataSources.map((source) => (
                      <tr
                        key={source.id}
                        className="transition-colors hover:bg-slate-800/30"
                      >
                        <td className="whitespace-nowrap px-5 py-3">
                          <span className="text-xs font-medium text-slate-200">
                            {source.name}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <code className="rounded bg-slate-900/60 px-1.5 py-0.5 text-[10px] text-slate-400">
                            {source.endpoint}
                          </code>
                        </td>
                        <td className="whitespace-nowrap px-5 py-3">
                          <span className="text-xs text-slate-400">
                            {source.type}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-5 py-3">
                          <div className="flex items-center gap-1.5">
                            {source.status === "connected" ? (
                              <Wifi className="h-3 w-3 text-emerald-400" />
                            ) : source.status === "degraded" ? (
                              <Activity className="h-3 w-3 text-amber-400" />
                            ) : (
                              <WifiOff className="h-3 w-3 text-red-400" />
                            )}
                            <Badge
                              variant={
                                source.status === "connected"
                                  ? "success"
                                  : source.status === "degraded"
                                  ? "warning"
                                  : "critical"
                              }
                            >
                              {source.status.charAt(0).toUpperCase() +
                                source.status.slice(1)}
                            </Badge>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-5 py-3">
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Clock className="h-3 w-3" />
                            {source.lastSync}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-5 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-700/50 text-slate-500 transition-colors hover:border-slate-600 hover:bg-slate-800 hover:text-slate-300">
                              <RefreshCw className="h-3 w-3" />
                            </button>
                            <button className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-700/50 text-slate-500 transition-colors hover:border-slate-600 hover:bg-slate-800 hover:text-slate-300">
                              <ExternalLink className="h-3 w-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Theme & Language */}
            <Card padding="md">
              <CardHeader>
                <CardTitle icon={<Monitor className="h-4 w-4" />}>
                  Appearance & Language
                </CardTitle>
              </CardHeader>

              <div className="space-y-5">
                {/* Theme Toggle */}
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Theme
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {(
                      [
                        {
                          value: "dark" as const,
                          label: "Dark",
                          icon: <Moon className="h-4 w-4" />,
                        },
                        {
                          value: "light" as const,
                          label: "Light",
                          icon: <Sun className="h-4 w-4" />,
                        },
                        {
                          value: "system" as const,
                          label: "System",
                          icon: <Monitor className="h-4 w-4" />,
                        },
                      ]
                    ).map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setTheme(opt.value)}
                        className={`flex flex-col items-center gap-2 rounded-lg border px-3 py-3 transition-colors ${
                          theme === opt.value
                            ? "border-blue-500/50 bg-blue-500/10 text-blue-400"
                            : "border-slate-700/50 bg-slate-900/50 text-slate-500 hover:border-slate-600 hover:text-slate-300"
                        }`}
                      >
                        {opt.icon}
                        <span className="text-xs font-medium">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Language Selector */}
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Language
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 transition-colors ${
                          language === lang.code
                            ? "border-blue-500/50 bg-blue-500/10 text-blue-400"
                            : "border-slate-700/50 bg-slate-900/50 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                        }`}
                      >
                        <Languages className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium">{lang.name}</span>
                        {language === lang.code && (
                          <CheckCircle2 className="ml-auto h-3.5 w-3.5 text-blue-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* About Section */}
            <Card padding="md">
              <CardHeader>
                <CardTitle icon={<Info className="h-4 w-4" />}>
                  About
                </CardTitle>
              </CardHeader>

              <div className="space-y-5">
                {/* 7Square Branding */}
                <div className="flex items-center gap-4 rounded-lg border border-slate-700/50 bg-slate-900/40 px-4 py-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20">
                    <Activity className="h-7 w-7 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-100">
                      SIRS
                    </h3>
                    <p className="text-xs text-slate-400">
                      SADC Impact Risk Studio
                    </p>
                    <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-blue-400">
                      Powered by 7Square
                    </p>
                  </div>
                </div>

                {/* Version Info */}
                <div className="space-y-2">
                  {[
                    { label: "Version", value: "1.0.0-beta.3" },
                    { label: "Build", value: "2026.02.10.1847" },
                    { label: "Environment", value: "Production" },
                    { label: "API Version", value: "v2.1.0" },
                    { label: "Last Updated", value: "February 10, 2026" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-lg bg-slate-900/40 px-3 py-2"
                    >
                      <span className="text-xs text-slate-500">{item.label}</span>
                      <span className="text-xs font-medium text-slate-300">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="rounded-lg border border-slate-700/30 bg-slate-900/30 px-4 py-3 text-center">
                  <p className="text-[10px] text-slate-600">
                    Developed by 7Square for the Southern African Development Community
                  </p>
                  <p className="mt-1 text-[10px] text-slate-600">
                    Supporting anticipatory action, disaster risk reduction, and evidence-based decision making across the SADC region
                  </p>
                  <div className="mt-2 flex items-center justify-center gap-3">
                    <a
                      href="#"
                      className="text-[10px] text-blue-400 transition-colors hover:text-blue-300"
                    >
                      Documentation
                    </a>
                    <span className="text-slate-700">|</span>
                    <a
                      href="#"
                      className="text-[10px] text-blue-400 transition-colors hover:text-blue-300"
                    >
                      Release Notes
                    </a>
                    <span className="text-slate-700">|</span>
                    <a
                      href="#"
                      className="text-[10px] text-blue-400 transition-colors hover:text-blue-300"
                    >
                      Support
                    </a>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
  );
}
