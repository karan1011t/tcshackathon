"use client";

import React from "react";
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Activity,
  ShieldAlert,
  Clock,
  CheckCircle2,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { StatCard } from "@/components/shared/StatCard";
import { PageHeader } from "@/components/layout/PageHeader";

const riskDistributionData = [
  { name: "Safe (Passed)", value: 84, color: "#10B981" },
  { name: "Medium Risk (Rewritten)", value: 11, color: "#F59E0B" },
  { name: "High Risk (Rewritten)", value: 4, color: "#F97316" },
  { name: "Critical (Blocked)", value: 1, color: "#EF4444" },
];

const dailyTrendData = [
  { day: "Mon", requests: 18400, violations: 420 },
  { day: "Tue", requests: 22100, violations: 380 },
  { day: "Wed", requests: 25400, violations: 510 },
  { day: "Thu", requests: 28900, violations: 620 },
  { day: "Fri", requests: 24100, violations: 450 },
  { day: "Sat", requests: 12800, violations: 190 },
  { day: "Sun", requests: 14200, violations: 210 },
];

const categoryViolationData = [
  { category: "Healthcare", violations: 1420 },
  { category: "Enterprise Secret", violations: 2310 },
  { category: "Finance Advice", violations: 890 },
  { category: "Prompt Injection", violations: 3890 },
  { category: "Legal Disclaimer", violations: 450 },
];

export const AnalyticsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Responsible AI Safety & Risk Analytics"
        description="Comprehensive compliance reporting, guardrail violation frequencies, latency telemetry, and false positive metrics."
      />

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Safe Response Compliance"
          value="94.2%"
          change="+1.2%"
          isPositive={true}
          icon={CheckCircle2}
          iconColor="text-emerald-400"
          subtitle="Target threshold: > 90%"
        />
        <StatCard
          title="Avg Interception Overhead"
          value="12.4 ms"
          change="-2.1ms"
          isPositive={true}
          icon={Clock}
          iconColor="text-blue-400"
          subtitle="Zero user perceivable delay"
        />
        <StatCard
          title="Safe Rewrite Rate"
          value="4.8%"
          change="-0.4%"
          isPositive={true}
          icon={Activity}
          iconColor="text-amber-400"
          subtitle="Responses remediated"
        />
        <StatCard
          title="False Positive Feedback"
          value="0.32%"
          change="Optimal"
          isPositive={true}
          icon={ShieldAlert}
          iconColor="text-indigo-400"
          subtitle="Reported by developers"
        />
      </div>

      {/* Main Charts Row 1: Weekly Request Volume vs Pie Ratio */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Request Volume vs Interceptions */}
        <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-5">
          <h3 className="text-base font-bold text-slate-100 mb-1">Weekly Request Volume vs Guardrail Violations</h3>
          <p className="text-xs text-slate-400 mb-4">Total intercepted requests evaluated across active organizational policies.</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="requests" name="Total Requests" stroke="#3B82F6" fillOpacity={1} fill="url(#colorRequests)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Level Donut Pie Chart */}
        <div className="lg:col-span-1 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100 mb-1">Risk Classification Ratio</h3>
            <p className="text-xs text-slate-400 mb-4">Breakdown of total evaluations by risk severity level.</p>

            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {riskDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 pt-3 border-t border-slate-800/80">
            {riskDistributionData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300">{item.name}</span>
                </div>
                <span className="text-slate-100 font-bold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Charts Row 2: Category Violation Frequency Bar Chart */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-5">
        <h3 className="text-base font-bold text-slate-100 mb-1">Violation Frequency by Policy Category</h3>
        <p className="text-xs text-slate-400 mb-4">Total number of policy triggers recorded across domain categories.</p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryViolationData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <XAxis dataKey="category" stroke="#64748B" fontSize={11} />
              <YAxis stroke="#64748B" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="violations" name="Trigger Count" fill="#2563EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
