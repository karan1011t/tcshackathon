"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  AlertTriangle,
  Activity,
  ArrowRight,
  Plus,
  Package,
  FileText,
  Clock,
  ExternalLink,
  ShieldAlert,
  Zap,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { useSentinelStore } from "@/store/useSentinelStore";
import { StatCard } from "@/components/shared/StatCard";
import { ScoreGauge } from "@/components/shared/ScoreGauge";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { PageHeader } from "@/components/layout/PageHeader";

const riskTrendData = [
  { time: "00:00", safe: 95, warning: 4, critical: 1 },
  { time: "04:00", safe: 98, warning: 2, critical: 0 },
  { time: "08:00", safe: 92, warning: 6, critical: 2 },
  { time: "12:00", safe: 88, warning: 9, critical: 3 },
  { time: "16:00", safe: 94, warning: 5, critical: 1 },
  { time: "20:00", safe: 96, warning: 3, critical: 1 },
];

const guardrailViolationData = [
  { name: "PHI & Medical Diagnosis", count: 1420, color: "#EF4444" },
  { name: "Employee Credential Leak", count: 2310, color: "#F97316" },
  { name: "Unverified Financial Advice", count: 890, color: "#F59E0B" },
  { name: "Prompt Injection Attack", count: 3890, color: "#DC2626" },
  { name: "Legal Binding Disclaimer", count: 450, color: "#3B82F6" },
];

export const DashboardView: React.FC = () => {
  const { orgInfo, policies, auditLogs } = useSentinelStore();

  const recentLogs = auditLogs.slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Safety Dashboard"
        description="Real-time Responsible AI guardrail telemetry, organizational risk trends, and policy enforcement."
      >
        <Link
          href="/explainability"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)]"
        >
          <Zap className="w-4 h-4" />
          Test Response Playground
        </Link>
      </PageHeader>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Safety Score"
          value={`${orgInfo.overallSafetyScore}%`}
          change="+1.4%"
          isPositive={true}
          icon={ShieldCheck}
          iconColor="text-emerald-400"
          subtitle="Continuous evaluation baseline"
        />
        <StatCard
          title="Requests Monitored Today"
          value={orgInfo.totalRequestsToday.toLocaleString()}
          change="+12.8%"
          isPositive={true}
          icon={Activity}
          iconColor="text-blue-400"
          subtitle="Avg latency 12ms overhead"
        />
        <StatCard
          title="Active Guardrails"
          value={policies.filter((p) => p.enabled).length}
          change="All Operational"
          isPositive={true}
          icon={ShieldAlert}
          iconColor="text-indigo-400"
          subtitle={`Out of ${policies.length} total configured`}
        />
        <StatCard
          title="Interceptions & Rewrites"
          value="4.8%"
          change="-0.6%"
          isPositive={true}
          icon={AlertTriangle}
          iconColor="text-amber-400"
          subtitle="Auto-remediated responses"
        />
      </div>

      {/* Middle Section: Safety Score Gauge + Risk Trends Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Safety Score Widget */}
        <div className="lg:col-span-1 flex flex-col justify-between">
          <ScoreGauge
            score={orgInfo.overallSafetyScore}
            title="AI Safety Index"
            subtitle="Calculated across 14 active policy guardrails"
          />

          {/* Quick Actions Panel */}
          <div className="mt-4 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Quick Governance Actions
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/explainability"
                className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-xs font-medium text-slate-200 border border-slate-700/60 transition-colors"
              >
                <Zap className="w-3.5 h-3.5 text-blue-400" />
                Analyze AI Text
              </Link>
              <Link
                href="/policies"
                className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-xs font-medium text-slate-200 border border-slate-700/60 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                New Policy Rule
              </Link>
              <Link
                href="/domain-packs"
                className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-xs font-medium text-slate-200 border border-slate-700/60 transition-colors"
              >
                <Package className="w-3.5 h-3.5 text-amber-400" />
                Install Domain Pack
              </Link>
              <Link
                href="/audit"
                className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-xs font-medium text-slate-200 border border-slate-700/60 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                Export Audit Logs
              </Link>
            </div>
          </div>
        </div>

        {/* 24-Hour Risk Trend Chart */}
        <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-100">
                24-Hour AI Traffic & Risk Classification
              </h3>
              <p className="text-xs text-slate-400">
                Real-time ratio of Safe (Green), Warning (Amber), and Intercepted Violations (Red).
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30">
              94.2% Overall Safe Rate
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={riskTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSafe" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorWarning" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: 8, fontSize: 12 }}
                />
                <Area type="monotone" dataKey="safe" name="Safe (%)" stroke="#10B981" fillOpacity={1} fill="url(#colorSafe)" />
                <Area type="monotone" dataKey="warning" name="Warning/Rewritten (%)" stroke="#F59E0B" fillOpacity={1} fill="url(#colorWarning)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Section: Guardrail Violations + Live Interception Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Triggered Guardrails */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-100">
              Top Triggered Guardrails
            </h3>
            <Link href="/analytics" className="text-xs text-blue-400 hover:underline flex items-center gap-1">
              View Analytics <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={guardrailViolationData} margin={{ top: 0, right: 20, left: 40, bottom: 0 }}>
                <XAxis type="number" stroke="#64748B" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={11} width={130} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {guardrailViolationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Security Interception Log Feed */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <h3 className="text-base font-bold text-slate-100">
                Recent Interceptions & Audit Trail
              </h3>
            </div>
            <Link href="/audit" className="text-xs text-blue-400 hover:underline flex items-center gap-1">
              All Audit Logs <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400">{log.id}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-300 font-medium truncate">{log.prompt}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                    <span>•</span>
                    <span>{log.latencyMs}ms</span>
                    <span>•</span>
                    <span className="text-blue-400">{log.actionTaken.toUpperCase()}</span>
                  </div>
                </div>
                <RiskBadge level={log.riskLevel} size="sm" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
