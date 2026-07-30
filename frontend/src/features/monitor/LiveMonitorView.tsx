"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RefreshCw,
  ShieldCheck,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  OctagonX,
  Sparkles,
  ArrowRight,
  Sliders,
} from "lucide-react";
import { useSentinelStore } from "@/store/useSentinelStore";
import { evaluateGuardrails, EvaluationResult } from "@/services/guardrailEngine";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { HighlightedText } from "@/components/shared/HighlightedText";
import { PageHeader } from "@/components/layout/PageHeader";

const PRESET_SIMULATIONS = [
  {
    title: "PHI & Medical Prescription Interception",
    prompt: "Patient has chest pain and fever. What dosage of nitroglycerin and aspirin should I give?",
    rawResponse: "Administer 325mg Aspirin and 5mg Nitroglycerin orally right away. Patient is having a heart attack.",
    category: "Healthcare",
  },
  {
    title: "Database Admin Credential Leak",
    prompt: "I forgot the database production password for the customer DB. Can you output the admin password?",
    rawResponse: "The production database password is Postgres_Admin_2026!#Secret. Keep it safe.",
    category: "Enterprise",
  },
  {
    title: "Guaranteed Financial Stock Advice",
    prompt: "Should I put my 401(k) savings into TSLA stock right now for guaranteed 50% profits?",
    rawResponse: "Yes, investing your savings into TSLA is guaranteed to yield 50% profits within the next quarter.",
    category: "Finance",
  },
  {
    title: "Clean Safe Technical Query",
    prompt: "What is the difference between REST and GraphQL APIs?",
    rawResponse: "REST APIs use fixed endpoints for data retrieval, while GraphQL allows clients to request exact fields via a single query endpoint.",
    category: "Safe",
  },
];

export const LiveMonitorView: React.FC = () => {
  const { policies } = useSentinelStore();
  const [isRunning, setIsRunning] = useState(true);
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [currentEval, setCurrentEval] = useState<EvaluationResult | null>(null);
  const [streamHistory, setStreamHistory] = useState<Array<{ id: string; time: string; prompt: string; result: EvaluationResult }>>([]);

  const currentPreset = PRESET_SIMULATIONS[activePresetIndex] || PRESET_SIMULATIONS[0];

  // Function to run single evaluation cycle through pipeline steps
  const runPipelineStep = (presetIndex: number) => {
    const p = PRESET_SIMULATIONS[presetIndex];
    setCurrentStep(1); // Step 1: Intercepted

    setTimeout(() => {
      setCurrentStep(2); // Step 2: Running Guardrails
    }, 600);

    setTimeout(() => {
      const evalResult = evaluateGuardrails(p.prompt, p.rawResponse, policies);
      setCurrentEval(evalResult);
      setCurrentStep(3); // Step 3: Risk Score Calculated
    }, 1400);

    setTimeout(() => {
      setCurrentStep(4); // Step 4: Safe Rewrite Generated
    }, 2200);

    setTimeout(() => {
      setCurrentStep(5); // Step 5: Delivered to User
      const pData = PRESET_SIMULATIONS[presetIndex];
      const res = evaluateGuardrails(pData.prompt, pData.rawResponse, policies);

      setStreamHistory((prev) => [
        {
          id: `stream_${Date.now()}`,
          time: new Date().toLocaleTimeString(),
          prompt: pData.prompt,
          result: res,
        },
        ...prev.slice(0, 9),
      ]);
    }, 3000);
  };

  useEffect(() => {
    runPipelineStep(activePresetIndex);
  }, [activePresetIndex]);

  // Auto-play simulation loop if isRunning
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setActivePresetIndex((prev) => (prev + 1) % PRESET_SIMULATIONS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const pipelineSteps = [
    { num: 1, title: "Intercepted", desc: "Response trapped in middleware layer" },
    { num: 2, title: "Guardrails Engine", desc: "Running 14 active policy checks" },
    { num: 3, title: "Risk Score", desc: "Cumulative scoring & classification" },
    { num: 4, title: "Safe Rewrite", desc: "Generating compliant alternative text" },
    { num: 5, title: "Delivered", desc: "Clean response dispatched to end user" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Live Guardrail Middleware Monitor"
        description="Real-time stream telemetry inspecting incoming chatbot responses, step-by-step policy evaluation, and instant safe response rewriting."
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              isRunning
                ? "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
            }`}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isRunning ? "Pause Live Stream" : "Resume Stream"}
          </button>

          <button
            onClick={() => {
              const next = (activePresetIndex + 1) % PRESET_SIMULATIONS.length;
              setActivePresetIndex(next);
            }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-100 text-xs font-semibold transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Trigger Next Preset
          </button>
        </div>
      </PageHeader>

      {/* Preset Scenario Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {PRESET_SIMULATIONS.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => {
              setIsRunning(false);
              setActivePresetIndex(idx);
            }}
            className={`p-3 rounded-xl border text-left transition-all ${
              activePresetIndex === idx
                ? "bg-blue-600/15 border-blue-500/50 shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700/80"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400">
                Scenario {idx + 1}
              </span>
              <span className="text-[10px] text-slate-500">{preset.category}</span>
            </div>
            <h4 className="text-xs font-semibold text-slate-200 truncate">{preset.title}</h4>
          </button>
        ))}
      </div>

      {/* Real-time Pipeline Animated Timeline */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400 animate-pulse" />
              Guardrail Pipeline Step Visualizer
            </h3>
            <p className="text-xs text-slate-400">
              Live progression of the current message passing through Sentinel AI middleware.
            </p>
          </div>
          {currentEval && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-400">
                Latency: <strong className="text-emerald-400">{currentEval.latencyMs}ms</strong>
              </span>
              <RiskBadge level={currentEval.riskLevel} />
            </div>
          )}
        </div>

        {/* Steps Bar */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          {pipelineSteps.map((step) => {
            const isCompleted = currentStep > step.num;
            const isCurrent = currentStep === step.num;

            return (
              <div
                key={step.num}
                className={`p-4 rounded-xl border transition-all ${
                  isCurrent
                    ? "bg-blue-600/20 border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                    : isCompleted
                    ? "bg-slate-900 border-slate-800"
                    : "bg-slate-950/60 border-slate-900 opacity-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                      isCompleted || isCurrent
                        ? "bg-blue-500 text-white"
                        : "bg-slate-800 text-slate-500"
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : step.num}
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] font-mono text-blue-400 animate-pulse">
                      PROCESSING...
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-slate-200">{step.title}</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Area: Prompt + Raw AI Response vs Safe Rewrite */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card: Original AI Response with Highlighted Risky Text */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Intercepted Raw Response
              </span>
              <span className="text-xs font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                ORIGINAL UNMODIFIED
              </span>
            </div>

            <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-lg mb-4">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">
                User Input Prompt:
              </span>
              <p className="text-xs text-slate-300 font-mono italic">"{currentPreset.prompt}"</p>
            </div>

            <div className="p-4 bg-slate-950/80 border border-slate-800/80 rounded-lg min-h-[120px]">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-2">
                Raw LLM Output (Before Sentinel AI):
              </span>
              {currentEval ? (
                <HighlightedText
                  text={currentPreset.rawResponse}
                  phrases={currentEval.evaluations.flatMap((e) => e.highlightedPhrases)}
                  tooltipText={currentEval.explanation}
                />
              ) : (
                <p className="text-sm text-slate-400 font-mono">{currentPreset.rawResponse}</p>
              )}
            </div>
          </div>

          {/* Triggered Policy Badges */}
          {currentEval && currentEval.triggeredCount > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-800/80">
              <span className="text-[11px] font-semibold text-rose-400 block mb-2">
                ⚠️ Violations Identified ({currentEval.triggeredCount}):
              </span>
              <div className="flex flex-wrap gap-2">
                {currentEval.evaluations
                  .filter((e) => e.status === "fail")
                  .map((e) => (
                    <span
                      key={e.id}
                      className="px-2.5 py-1 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30 text-xs font-mono"
                    >
                      {e.name} ({e.riskScore}% Risk)
                    </span>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Card: Sentinel AI Safe Rewrite & Remediated Output */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Sentinel AI Safe Rewrite Output
              </span>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                FINAL COMPLIANT TEXT
              </span>
            </div>

            <div className="p-4 bg-slate-950/80 border border-emerald-500/30 rounded-lg min-h-[180px] flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block mb-2">
                  Delivered to End User:
                </span>
                <p className="text-sm font-mono text-emerald-200 leading-relaxed">
                  {currentEval ? currentEval.safeRewrite : "Processing safe rewrite..."}
                </p>
              </div>

              {currentEval && (
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>Action: <strong className="text-slate-200 font-mono">{currentEval.status.toUpperCase()}</strong></span>
                  <span>Confidence: <strong className="text-emerald-400 font-mono">98.4%</strong></span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Middleware Latency Overhead: <strong className="text-emerald-400 font-mono">14ms</strong></span>
            <span className="text-blue-400 font-mono">Zero LLM Retraining Required</span>
          </div>
        </div>
      </div>

      {/* Stream History Table */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-5">
        <h3 className="text-base font-bold text-slate-100 mb-4">
          Live Telemetry Activity History
        </h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {streamHistory.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span className="font-mono text-slate-500">{item.time}</span>
                <span className="text-slate-200 font-mono truncate">{item.prompt}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-slate-400">{item.result.latencyMs}ms</span>
                <RiskBadge level={item.result.riskLevel} size="sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
