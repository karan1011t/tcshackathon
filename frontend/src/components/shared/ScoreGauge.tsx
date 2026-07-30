"use client";

import React from "react";
import { motion } from "framer-motion";

interface ScoreGaugeProps {
  score: number; // 0 to 100
  title?: string;
  subtitle?: string;
  size?: number;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  title = "Overall Safety Score",
  subtitle = "Continuous Policy Evaluation",
  size = 180,
}) => {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let colorClass = "#10B981"; // Emerald
  if (score < 50) colorClass = "#EF4444"; // Red
  else if (score < 80) colorClass = "#F59E0B"; // Amber

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md rounded-xl border border-slate-800/80 shadow-xl">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1E293B"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colorClass}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold font-mono tracking-tight text-slate-100">
            {score.toFixed(1)}%
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 mt-0.5">
            PASSED
          </span>
        </div>
      </div>
      <div className="text-center mt-3">
        <h4 className="text-sm font-semibold text-slate-200">{title}</h4>
        <p className="text-xs text-slate-400">{subtitle}</p>
      </div>
    </div>
  );
};
