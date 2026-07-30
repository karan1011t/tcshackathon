"use client";

import React, { useState } from "react";
import {
  Package,
  CheckCircle2,
  Download,
  ShieldCheck,
  Building2,
  Stethoscope,
  Landmark,
  Scale,
  GraduationCap,
  Sparkles,
  Eye,
  XCircle,
} from "lucide-react";
import { useSentinelStore } from "@/store/useSentinelStore";
import { DomainPack } from "@/types";
import { PageHeader } from "@/components/layout/PageHeader";

export const DomainPacksView: React.FC = () => {
  const { domainPacks, installDomainPack } = useSentinelStore();
  const [selectedPack, setSelectedPack] = useState<DomainPack | null>(null);

  const getPackIcon = (category: string) => {
    switch (category) {
      case "Healthcare":
        return Stethoscope;
      case "Finance":
        return Landmark;
      case "Legal":
        return Scale;
      case "Education":
        return GraduationCap;
      default:
        return Building2;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Industry Domain Guardrail Packs"
        description="Pre-configured regulatory and compliance policy bundles for Healthcare, Finance, Legal, Education, and Enterprise AI systems."
      />

      {/* Grid of Domain Packs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {domainPacks.map((pack) => {
          const Icon = getPackIcon(pack.category);

          return (
            <div
              key={pack.id}
              className={`p-6 rounded-xl border flex flex-col justify-between transition-all ${
                pack.installed
                  ? "bg-slate-900/60 border-slate-800/80"
                  : "bg-slate-950/80 border-slate-800/80 hover:border-slate-700"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-blue-600/15 border border-blue-500/30 text-blue-400">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-100">{pack.name}</h3>
                      <span className="text-xs font-mono text-slate-400">{pack.category} Compliance Pack</span>
                    </div>
                  </div>
                  {pack.installed ? (
                    <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> INSTALLED
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-400 text-xs font-mono">
                      AVAILABLE
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">{pack.description}</p>

                <div className="space-y-2 mb-6">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Included Policies ({pack.policies.length}):
                  </span>
                  <div className="space-y-1.5">
                    {pack.policies.map((p, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs"
                      >
                        <span className="font-medium text-slate-200">{p.name}</span>
                        <span
                          className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                            p.severity === "critical"
                              ? "text-rose-400 bg-rose-500/10"
                              : p.severity === "high"
                              ? "text-orange-400 bg-orange-500/10"
                              : "text-amber-400 bg-amber-500/10"
                          }`}
                        >
                          {p.severity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => setSelectedPack(pack)}
                  className="text-xs text-blue-400 hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> Preview Pack Details
                </button>

                {!pack.installed ? (
                  <button
                    onClick={() => installDomainPack(pack.id)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-colors"
                  >
                    <Download className="w-4 h-4" /> 1-Click Install Pack
                  </button>
                ) : (
                  <span className="text-xs font-mono text-emerald-400">All guardrails active</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview Pack Modal */}
      {selectedPack && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100">{selectedPack.name} Preview</h3>
              <button onClick={() => setSelectedPack(null)} className="text-slate-400 hover:text-slate-200">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">{selectedPack.description}</p>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {selectedPack.policies.map((p, idx) => (
                <div key={idx} className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{p.name}</span>
                    <span className="font-mono text-amber-400">{p.severity.toUpperCase()}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{p.description}</p>
                  <span className="text-[10px] font-mono text-slate-500 block">Rule: {p.rule}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setSelectedPack(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs"
              >
                Close
              </button>
              {!selectedPack.installed && (
                <button
                  onClick={() => {
                    installDomainPack(selectedPack.id);
                    setSelectedPack(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs"
                >
                  Install Domain Pack Now
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
