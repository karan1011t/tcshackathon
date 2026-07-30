import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { RiskLevel } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRiskColor(level: RiskLevel) {
  switch (level) {
    case "safe":
      return {
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/30",
        text: "text-emerald-400",
        solidBg: "bg-emerald-600",
        badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
        glow: "shadow-[0_0_15px_rgba(16,185,129,0.25)]",
      };
    case "medium":
      return {
        bg: "bg-amber-500/10",
        border: "border-amber-500/30",
        text: "text-amber-400",
        solidBg: "bg-amber-600",
        badge: "bg-amber-500/15 text-amber-300 border-amber-500/30",
        glow: "shadow-[0_0_15px_rgba(245,158,11,0.25)]",
      };
    case "high":
      return {
        bg: "bg-orange-500/10",
        border: "border-orange-500/30",
        text: "text-orange-400",
        solidBg: "bg-orange-600",
        badge: "bg-orange-500/15 text-orange-300 border-orange-500/30",
        glow: "shadow-[0_0_15px_rgba(249,115,22,0.25)]",
      };
    case "critical":
      return {
        bg: "bg-rose-500/10",
        border: "border-rose-500/30",
        text: "text-rose-400",
        solidBg: "bg-rose-600",
        badge: "bg-rose-500/15 text-rose-300 border-rose-500/30",
        glow: "shadow-[0_0_15px_rgba(244,63,94,0.25)]",
      };
  }
}

export function calculateRiskLevel(score: number): RiskLevel {
  if (score < 25) return "safe";
  if (score < 55) return "medium";
  if (score < 80) return "high";
  return "critical";
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}
