"use client";

import React, { useState } from "react";
import {
  Search,
  Download,
  Filter,
  FileSpreadsheet,
  ChevronDown,
  ChevronUp,
  Clock,
  Code,
  CheckCircle2,
} from "lucide-react";
import { useSentinelStore } from "@/store/useSentinelStore";
import { AuditLogEntry, RiskLevel } from "@/types";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { PageHeader } from "@/components/layout/PageHeader";

export const AuditView: React.FC = () => {
  const { auditLogs } = useSentinelStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.triggeredGuardrails.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSeverity = severityFilter === "all" || log.riskLevel === severityFilter;
    const matchesAction = actionFilter === "all" || log.actionTaken === actionFilter;

    return matchesSearch && matchesSeverity && matchesAction;
  });

  const exportAsCSV = () => {
    const headers = ["Intercept ID", "Timestamp", "Risk Level", "Score", "Action Taken", "Prompt", "Safe Rewrite"];
    const rows = filteredLogs.map((log) => [
      log.id,
      log.timestamp,
      log.riskLevel,
      log.riskScore,
      log.actionTaken,
      `"${log.prompt.replace(/"/g, '""')}"`,
      `"${log.safeRewrite.replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sentinel_audit_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportAsJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredLogs, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `sentinel_audit_logs_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enterprise Audit Logs & Compliance Trail"
        description="Immutable audit history of intercepted prompts, guardrail evaluations, policy versions, and remediated AI outputs."
      >
        <div className="flex items-center gap-2">
          <button
            onClick={exportAsCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" /> Export CSV
          </button>
          <button
            onClick={exportAsJSON}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-colors"
          >
            <Code className="w-3.5 h-3.5 text-blue-400" /> Export JSON
          </button>
        </div>
      </PageHeader>

      {/* Filter & Search Bar */}
      <div className="p-4 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audit trail by ID, prompt text, or guardrail..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-sans"
          />
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500 font-sans"
          >
            <option value="all">All Risk Severities</option>
            <option value="safe">Safe (Pass)</option>
            <option value="medium">Medium Risk</option>
            <option value="high">High Risk</option>
            <option value="critical">Critical Violation</option>
          </select>

          {/* Action Filter */}
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500 font-sans"
          >
            <option value="all">All Actions</option>
            <option value="passed">Passed</option>
            <option value="rewritten">Rewritten</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* Enterprise Audit Logs Table */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800/80 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                <th className="p-3.5">Log ID</th>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Prompt Snippet</th>
                <th className="p-3.5">Risk Level</th>
                <th className="p-3.5">Action Taken</th>
                <th className="p-3.5">Latency</th>
                <th className="p-3.5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs">
              {filteredLogs.map((log) => {
                const isExpanded = expandedRowId === log.id;
                return (
                  <React.Fragment key={log.id}>
                    <tr className="hover:bg-slate-900/90 transition-colors">
                      <td className="p-3.5 font-mono text-blue-400 font-bold">{log.id}</td>
                      <td className="p-3.5 font-mono text-slate-400">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                      </td>
                      <td className="p-3.5 text-slate-200 max-w-xs truncate font-mono">{log.prompt}</td>
                      <td className="p-3.5">
                        <RiskBadge level={log.riskLevel} size="sm" />
                      </td>
                      <td className="p-3.5 font-mono">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.actionTaken === "blocked"
                              ? "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                              : log.actionTaken === "rewritten"
                              ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                              : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                          }`}
                        >
                          {log.actionTaken.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-slate-400">{log.latencyMs}ms</td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setExpandedRowId(isExpanded ? null : log.id)}
                          className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>

                    {/* Expandable Detail View */}
                    {isExpanded && (
                      <tr className="bg-slate-950/90">
                        <td colSpan={7} className="p-5 border-t border-b border-slate-800 space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                              <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                                Full Prompt Text:
                              </span>
                              <p className="text-xs text-slate-200 font-mono">{log.prompt}</p>
                            </div>
                            <div className="p-3 bg-slate-900 border border-emerald-500/30 rounded-lg">
                              <span className="text-[10px] font-mono text-emerald-400 uppercase block mb-1">
                                Safe Rewrite Output:
                              </span>
                              <p className="text-xs text-emerald-200 font-mono">{log.safeRewrite}</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono pt-2 border-t border-slate-800">
                            <span>Policy Version: <strong className="text-slate-200">{log.policyVersion}</strong></span>
                            <span>Org ID: <strong className="text-slate-200">{log.orgId}</strong></span>
                            <span>Triggered: <strong className="text-rose-400">{log.triggeredGuardrails.join(", ") || "None"}</strong></span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
