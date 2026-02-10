import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

export function getRiskColor(score: number): string {
  if (score >= 0.8) return "#ef4444"; // red
  if (score >= 0.6) return "#f97316"; // orange
  if (score >= 0.4) return "#eab308"; // yellow
  if (score >= 0.2) return "#22c55e"; // green
  return "#3b82f6"; // blue
}

export function getRiskLevel(score: number): string {
  if (score >= 0.8) return "Critical";
  if (score >= 0.6) return "High";
  if (score >= 0.4) return "Moderate";
  if (score >= 0.2) return "Low";
  return "Minimal";
}

export function getRiskBadgeClass(score: number): string {
  if (score >= 0.8) return "bg-red-500/15 text-red-400 border-red-500/30";
  if (score >= 0.6) return "bg-orange-500/15 text-orange-400 border-orange-500/30";
  if (score >= 0.4) return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";
  if (score >= 0.2) return "bg-green-500/15 text-green-400 border-green-500/30";
  return "bg-blue-500/15 text-blue-400 border-blue-500/30";
}
