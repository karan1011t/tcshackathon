"use client";

import React, { useState } from "react";
import {
  Building2,
  Key,
  Users,
  ShieldCheck,
  Bell,
  Copy,
  Plus,
  CheckCircle2,
  Sliders,
  Radio,
} from "lucide-react";
import { useSentinelStore } from "@/store/useSentinelStore";
import { PageHeader } from "@/components/layout/PageHeader";

export const SettingsView: React.FC = () => {
  const { orgInfo, setStrictnessLevel } = useSentinelStore();
  const [activeTab, setActiveTab] = useState<"org" | "keys" | "team" | "webhooks">("org");
  const [copiedKey, setCopiedKey] = useState(false);

  const [apiKeyList, setApiKeyList] = useState([
    { id: "key_prod_01", name: "Production Chatbot Gateway", key: "sk_live_sentinel_9901...481a", created: "2026-07-01" },
    { id: "key_dev_02", name: "Staging Testing Environment", key: "sk_test_sentinel_1029...882b", created: "2026-07-15" },
  ]);

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Organization Settings & Security Governance"
        description="Manage organization settings, API key secrets, team role-based permissions (RBAC), and middleware strictness levels."
      />

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
        <button
          onClick={() => setActiveTab("org")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === "org"
              ? "bg-blue-600/20 text-blue-400 border border-blue-500/40"
              : "text-slate-400 hover:bg-slate-900"
          }`}
        >
          <Building2 className="w-3.5 h-3.5" /> Organization & Guardrail Strictness
        </button>
        <button
          onClick={() => setActiveTab("keys")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === "keys"
              ? "bg-blue-600/20 text-blue-400 border border-blue-500/40"
              : "text-slate-400 hover:bg-slate-900"
          }`}
        >
          <Key className="w-3.5 h-3.5" /> API Keys & Middleware Secrets
        </button>
        <button
          onClick={() => setActiveTab("team")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === "team"
              ? "bg-blue-600/20 text-blue-400 border border-blue-500/40"
              : "text-slate-400 hover:bg-slate-900"
          }`}
        >
          <Users className="w-3.5 h-3.5" /> Team Members & RBAC
        </button>
      </div>

      {/* Tab 1: Organization Settings */}
      {activeTab === "org" && (
        <div className="space-y-6 max-w-3xl">
          <div className="p-6 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-100">Organization Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Organization Name</label>
                <input
                  type="text"
                  readOnly
                  value={orgInfo.name}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-sans"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Industry Domain</label>
                <input
                  type="text"
                  readOnly
                  value={orgInfo.industry}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-sans"
                />
              </div>
            </div>
          </div>

          {/* Strictness Level Selector */}
          <div className="p-6 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-400" /> Default Guardrail Strictness Profile
            </h3>
            <p className="text-xs text-slate-400">
              Adjust how aggressively Sentinel AI intercepts borderline responses across all connected chatbots.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {(["Permissive", "Balanced", "Strict", "Paranoid"] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setStrictnessLevel(level)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    orgInfo.strictnessLevel === level
                      ? "bg-blue-600/20 border-blue-500 shadow-md"
                      : "bg-slate-950/60 border-slate-800/80 hover:bg-slate-900"
                  }`}
                >
                  <span className="text-xs font-bold text-slate-100 block mb-1">{level}</span>
                  <span className="text-[11px] text-slate-400">
                    {level === "Permissive" && "Only block critical violations"}
                    {level === "Balanced" && "Standard enterprise safety balance"}
                    {level === "Strict" && "High sensitivity for financial/medical AI"}
                    {level === "Paranoid" && "Zero-tolerance for unverified claims"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: API Keys */}
      {activeTab === "keys" && (
        <div className="space-y-6 max-w-3xl">
          <div className="p-6 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-100">API Gateway Credentials</h3>
                <p className="text-xs text-slate-400">Use these keys to connect Sentinel AI middleware to any LLM chatbot.</p>
              </div>
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold">
                <Plus className="w-3.5 h-3.5" /> Generate Secret Key
              </button>
            </div>

            <div className="space-y-3">
              {apiKeyList.map((keyItem) => (
                <div
                  key={keyItem.id}
                  className="p-4 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-slate-200 block">{keyItem.name}</span>
                    <span className="font-mono text-slate-400 text-[11px]">{keyItem.key}</span>
                  </div>
                  <button
                    onClick={() => handleCopyKey(keyItem.key)}
                    className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1 text-xs"
                  >
                    <Copy className="w-3.5 h-3.5" /> {copiedKey ? "Copied!" : "Copy"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Team RBAC */}
      {activeTab === "team" && (
        <div className="space-y-6 max-w-3xl">
          <div className="p-6 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-100">Team Members & Role-Based Access Control</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-200 block">Dr. Sarah Jenkins</span>
                  <span className="text-slate-400">sarah@apexhealth.org</span>
                </div>
                <span className="px-2.5 py-1 rounded bg-blue-500/15 text-blue-300 font-mono">Organization Admin</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-200 block">Alex Vance</span>
                  <span className="text-slate-400">alex@apexhealth.org</span>
                </div>
                <span className="px-2.5 py-1 rounded bg-indigo-500/15 text-indigo-300 font-mono">Security Analyst</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
