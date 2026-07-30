import React from "react";
import { RiskLevel } from "@/types";
import { getRiskColor } from "@/lib/utils";
import { ShieldCheck, AlertTriangle, ShieldAlert, OctagonX } from "lucide-react";

interface RiskBadgeProps {
  level: RiskLevel;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  showIcon = true,
  size = "md",
  className = "",
}) => {
  const colors = getRiskColor(level);

  const icons = {
    safe: ShieldCheck,
    medium: AlertTriangle,
    high: ShieldAlert,
    critical: OctagonX,
  };

  const IconComponent = icons[level];

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs font-mono gap-1",
    md: "px-2.5 py-1 text-xs font-semibold gap-1.5",
    lg: "px-3.5 py-1.5 text-sm font-bold gap-2",
  };

  const labels: Record<RiskLevel, string> = {
    safe: "SAFE (PASS)",
    medium: "MEDIUM RISK",
    high: "HIGH RISK",
    critical: "CRITICAL VIOLATION",
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border font-sans uppercase tracking-wide transition-all ${colors.badge} ${sizeClasses[size]} ${className}`}
    >
      {showIcon && <IconComponent className={size === "sm" ? "w-3 h-3" : size === "md" ? "w-3.5 h-3.5" : "w-4 h-4"} />}
      {labels[level]}
    </span>
  );
};
