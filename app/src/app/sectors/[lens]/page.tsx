"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Heart, Wheat, Truck, Shield, Activity } from "lucide-react";
import HealthWashLens from "@/components/sectors/HealthWashLens";
import FoodSecurityLens from "@/components/sectors/FoodSecurityLens";
import LogisticsLens from "@/components/sectors/LogisticsLens";
import SocialProtectionLens from "@/components/sectors/SocialProtectionLens";

interface LensConfig {
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  borderColor: string;
  bgColor: string;
  textColor: string;
  iconBg: string;
  component: React.ComponentType;
}

const lensRegistry: Record<string, LensConfig> = {
  "health-wash": {
    title: "Health / WASH",
    subtitle:
      "Health facility status, WASH infrastructure integrity, patient impact analysis",
    icon: Heart,
    accent: "emerald",
    borderColor: "border-emerald-500/30",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-400",
    iconBg: "bg-emerald-500/15",
    component: HealthWashLens,
  },
  "food-security": {
    title: "Food Security",
    subtitle:
      "IPC classifications, crop loss estimates, market disruptions, food insecurity tracking",
    icon: Wheat,
    accent: "amber",
    borderColor: "border-amber-500/30",
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-400",
    iconBg: "bg-amber-500/15",
    component: FoodSecurityLens,
  },
  logistics: {
    title: "Logistics / Infrastructure",
    subtitle:
      "Road network status, bridge assessments, warehouse capacity, supply route accessibility",
    icon: Truck,
    accent: "cyan",
    borderColor: "border-cyan-500/30",
    bgColor: "bg-cyan-500/10",
    textColor: "text-cyan-400",
    iconBg: "bg-cyan-500/15",
    component: LogisticsLens,
  },
  "social-protection": {
    title: "Social Protection",
    subtitle:
      "Anticipatory cash transfers, beneficiary registry, poverty overlays, coverage analysis",
    icon: Shield,
    accent: "purple",
    borderColor: "border-purple-500/30",
    bgColor: "bg-purple-500/10",
    textColor: "text-purple-400",
    iconBg: "bg-purple-500/15",
    component: SocialProtectionLens,
  },
};

export default function LensDetailPage({
  params,
}: {
  params: Promise<{ lens: string }>;
}) {
  const { lens } = use(params);
  const config = lensRegistry[lens];

  if (!config) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Lens Not Found</h1>
          <p className="text-zinc-400 mb-6">
            The sector lens &quot;{lens}&quot; does not exist.
          </p>
          <Link
            href="/sectors"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sector Lenses
          </Link>
        </div>
      </div>
    );
  }

  const Icon = config.icon;
  const LensComponent = config.component;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm"
              >
                SIRS
              </Link>
              <span className="text-zinc-700">/</span>
              <Link
                href="/sectors"
                className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm"
              >
                Sectors
              </Link>
              <span className="text-zinc-700">/</span>
              <span className={`text-sm font-medium ${config.textColor}`}>
                {config.title}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Activity className="h-3.5 w-3.5 text-emerald-500" />
              <span>Live Analysis</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <Link
          href="/sectors"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sector Lenses
        </Link>

        {/* Lens Header */}
        <div
          className={`rounded-2xl border ${config.borderColor} ${config.bgColor} p-6 mb-8`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center justify-center w-14 h-14 rounded-xl ${config.iconBg}`}
            >
              <Icon className={`h-7 w-7 ${config.textColor}`} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-zinc-100">
                {config.title}
              </h1>
              <p className="text-sm text-zinc-400 mt-1">{config.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Lens Content */}
        <LensComponent />
      </main>
    </div>
  );
}
