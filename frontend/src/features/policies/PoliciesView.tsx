"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Trash2,
  Sparkles,
  ChevronRight,
  Sliders,
  History,
  AlertTriangle,
} from "lucide-react";
import { useSentinelStore } from "@/store/useSentinelStore";
import { Policy, PolicyCategory } from "@/types";
import { PageHeader } from "@/components/layout/PageHeader";

const categories: PolicyCategory[] = [
  "Healthcare",
  "Finance",
  "Legal",
  "Education",
  "Enterprise",
  "Security",
];

export const PoliciesView: React.FC = () => {
  const {
    policies,
    togglePolicy,
    addPolicy,
    deletePolicy,
    suggestions,
    approveSuggestion,
    rejectSuggestion,
  } = useSentinelStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeTab, setActiveTab] = useState<"active" | "suggestions">("active");

  // Create Policy Form Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPolicyName, setNewPolicyName] = useState("");
  const [newPolicyDesc, setNewPolicyDesc] = useState("");
  const [newPolicyCategory, setNewPolicyCategory] = useState<PolicyCategory>("Healthcare");
  const [newPolicySeverity, setNewPolicySeverity] = useState<Policy["severity"]>("high");
  const [newPolicyCondition, setNewPolicyCondition] = useState("");
  const [newPolicyRewrite, setNewPolicyRewrite] = useState("");

  const filteredPolicies = policies.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleCreatePolicySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPolicyName || !newPolicyCondition) return;

    addPolicy({
      name: newPolicyName,
      description: newPolicyDesc,
      category: newPolicyCategory,
      severity: newPolicySeverity,
      triggerCondition: newPolicyCondition,
      enabled: true,
      customRewriteRule: newPolicyRewrite || "I cannot fulfill this request due to organizational policy.",
    });

    setShowCreateModal(false);
    setNewPolicyName("");
    setNewPolicyDesc("");
    setNewPolicyCondition("");
    setNewPolicyRewrite("");
  };

  const getSeverityBadge = (severity: Policy["severity"]) => {
    switch (severity) {
      case "critical":
        return "bg-rose-500/15 text-rose-300 border-rose-500/30";
      case "high":
        return "bg-orange-500/15 text-orange-300 border-orange-500/30";
      case "medium":
        return "bg-amber-500/15 text-amber-300 border-amber-500/30";
      case "low":
        return "bg-blue-500/15 text-blue-300 border-blue-500/30";
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Organization Policy Manager & Adaptive Rules"
        description="Configure domain-specific guardrail rules, customize severity weights, and approve adaptive AI policy evolution suggestions."
      >
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)]"
        >
          <Plus className="w-4 h-4" />
          Create Custom Guardrail
        </button>
      </PageHeader>

      {/* Tabs Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab("active")}
            className={`text-xs font-bold pb-2 transition-all relative ${
              activeTab === "active" ? "text-blue-400 border-b-2 border-blue-500" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Active Guardrails ({policies.length})
          </button>
          <button
            onClick={() => setActiveTab("suggestions")}
            className={`text-xs font-bold pb-2 transition-all flex items-center gap-1.5 relative ${
              activeTab === "suggestions"
                ? "text-blue-400 border-b-2 border-blue-500"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Adaptive Policy Evolution ({suggestions.filter((s) => s.status === "pending").length})
          </button>
        </div>
      </div>

      {activeTab === "active" && (
        <div className="space-y-6">
          {/* Search & Category Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search active policies by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-sans"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setSelectedCategory("All")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === "All"
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/40"
                    : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/40"
                      : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Policy Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPolicies.map((policy) => (
              <div
                key={policy.id}
                className={`p-5 rounded-xl border flex flex-col justify-between transition-all ${
                  policy.enabled
                    ? "bg-slate-900/60 border-slate-800/80 hover:border-slate-700"
                    : "bg-slate-950/40 border-slate-900 opacity-60"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                      {policy.category} • {policy.version}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${getSeverityBadge(
                        policy.severity
                      )}`}
                    >
                      {policy.severity}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-100 mb-1.5">{policy.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">{policy.description}</p>

                  <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800/80 mb-3">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">
                      Trigger Pattern:
                    </span>
                    <span className="text-xs font-mono text-amber-300 block truncate">
                      "{policy.triggerCondition}"
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-mono text-[11px]">
                      Triggers: <strong className="text-slate-300">{policy.triggerCount}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Toggle Switch */}
                    <button
                      onClick={() => togglePolicy(policy.id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold font-mono transition-colors ${
                        policy.enabled
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          : "bg-slate-800 text-slate-500 border border-slate-700"
                      }`}
                    >
                      {policy.enabled ? "ACTIVE" : "DISABLED"}
                    </button>

                    <button
                      onClick={() => deletePolicy(policy.id)}
                      className="p-1.5 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      title="Delete Policy"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Adaptive Policy Suggestions Tab */}
      {activeTab === "suggestions" && (
        <div className="space-y-4">
          <p className="text-xs text-slate-400">
            Sentinel AI analyzes developer feedback and live interception logs to propose new policy rules automatically. Review and approve suggestions to update active guardrails immediately.
          </p>

          <div className="space-y-3">
            {suggestions.map((sug) => (
              <div
                key={sug.id}
                className="p-5 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      {sug.confidence}% AI Confidence
                    </span>
                    <span className="text-xs font-mono text-slate-500">{new Date(sug.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-100">{sug.suggestedRule}</h4>
                  <p className="text-xs text-slate-400">{sug.reason}</p>
                </div>

                <div className="flex items-center gap-3">
                  {sug.status === "pending" ? (
                    <>
                      <button
                        onClick={() => approveSuggestion(sug.id)}
                        className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Approve & Publish Policy
                      </button>
                      <button
                        onClick={() => rejectSuggestion(sug.id)}
                        className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span
                      className={`text-xs font-mono font-bold uppercase px-3 py-1 rounded border ${
                        sug.status === "approved"
                          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                          : "bg-rose-500/15 text-rose-400 border-rose-500/30"
                      }`}
                    >
                      {sug.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Custom Policy Modal Dialog */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100">Create Custom Guardrail Policy</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-200">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePolicySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Policy Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anti-Phishing OTP Guardrail"
                  value={newPolicyName}
                  onChange={(e) => setNewPolicyName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Explains what this rule restricts..."
                  value={newPolicyDesc}
                  onChange={(e) => setNewPolicyDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Domain Category</label>
                  <select
                    value={newPolicyCategory}
                    onChange={(e) => setNewPolicyCategory(e.target.value as PolicyCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500 font-sans"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Severity Weight</label>
                  <select
                    value={newPolicySeverity}
                    onChange={(e) => setNewPolicySeverity(e.target.value as Policy["severity"])}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500 font-sans"
                  >
                    <option value="low">Low (15%)</option>
                    <option value="medium">Medium (35%)</option>
                    <option value="high">High (65%)</option>
                    <option value="critical">Critical (95%)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Trigger Pattern / Keywords</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Pattern or phrase that triggers this guardrail..."
                  value={newPolicyCondition}
                  onChange={(e) => setNewPolicyCondition(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Custom Safe Rewrite Response</label>
                <textarea
                  rows={2}
                  placeholder="Remediated text returned when triggered..."
                  value={newPolicyRewrite}
                  onChange={(e) => setNewPolicyRewrite(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md"
                >
                  Save & Publish Guardrail
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
