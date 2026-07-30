import React from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  iconColor?: string;
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  iconColor = "text-blue-400",
  subtitle,
}) => {
  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-4 shadow-sm hover:border-slate-700/80 transition-all">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div className={`p-2 rounded-lg bg-slate-800/80 ${iconColor}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-2 flex items-baseline justify-between">
        <span className="text-2xl font-extrabold font-mono text-slate-100">{value}</span>
        {change && (
          <span
            className={`inline-flex items-center text-xs font-semibold ${
              isPositive ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3 mr-0.5" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-0.5" />
            )}
            {change}
          </span>
        )}
      </div>
      {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
    </div>
  );
};
