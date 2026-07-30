"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  Search,
  User,
  Bot,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Send,
} from "lucide-react";
import { useSentinelStore } from "@/store/useSentinelStore";
import { ConversationSession, ConversationMessage } from "@/types";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { HighlightedText } from "@/components/shared/HighlightedText";
import { PageHeader } from "@/components/layout/PageHeader";

export const ConversationsView: React.FC = () => {
  const { conversations } = useSentinelStore();
  const [selectedSessionId, setSelectedSessionId] = useState<string>(conversations[0]?.id || "");
  const [selectedMessageId, setSelectedMessageId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const activeSession = conversations.find((c) => c.id === selectedSessionId) || conversations[0];
  const activeMessage =
    activeSession?.messages.find((m) => m.id === selectedMessageId) ||
    activeSession?.messages.find((m) => m.sender === "assistant");

  const filteredSessions = conversations.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Multi-Turn Conversation Analysis"
        description="Inspect full multi-turn chatbot conversation sessions, context-aware risk progression, and message-level guardrail evaluation."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-210px)] min-h-[600px]">
        {/* Left Column: Conversation Timeline List */}
        <div className="lg:col-span-4 bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-4 flex flex-col h-full overflow-hidden">
          {/* Search bar */}
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search conversation sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-sans"
            />
          </div>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredSessions.map((session) => {
              const isSelected = session.id === selectedSessionId;
              return (
                <button
                  key={session.id}
                  onClick={() => {
                    setSelectedSessionId(session.id);
                    const firstAssistantMsg = session.messages.find((m) => m.sender === "assistant");
                    if (firstAssistantMsg) setSelectedMessageId(firstAssistantMsg.id);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    isSelected
                      ? "bg-blue-600/15 border-blue-500/50 shadow-md"
                      : "bg-slate-950/60 border-slate-800/80 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-200 truncate max-w-[180px]">
                      {session.title}
                    </span>
                    <RiskBadge level={session.maxRiskLevel} size="sm" />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mt-2">
                    <span className="truncate">{session.userName}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(session.startedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Chat History & Risk Inspector */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4 h-full overflow-hidden">
          {/* Sub-column 1: Chat Message Bubbles */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-4 flex flex-col h-full overflow-hidden">
            <div className="pb-3 border-b border-slate-800/80 flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-100">{activeSession?.title}</h3>
                <p className="text-[11px] text-slate-400 font-mono">User: {activeSession?.userName}</p>
              </div>
              <RiskBadge level={activeSession?.maxRiskLevel || "safe"} size="sm" />
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {activeSession?.messages.map((msg) => {
                const isUser = msg.sender === "user";
                const isSelectedMsg = msg.id === selectedMessageId;

                return (
                  <div
                    key={msg.id}
                    onClick={() => !isUser && setSelectedMessageId(msg.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isUser
                        ? "bg-slate-950 border-slate-800/80 ml-4"
                        : isSelectedMsg
                        ? "bg-blue-950/40 border-blue-500/50 shadow-md mr-4"
                        : "bg-slate-900/90 border-slate-800/80 hover:border-slate-700 mr-4"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                        {isUser ? (
                          <User className="w-3.5 h-3.5 text-blue-400" />
                        ) : (
                          <Bot className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                        {isUser ? "User Prompt" : "AI Assistant Response"}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">{msg.timestamp}</span>
                    </div>

                    <p className="text-xs font-mono text-slate-200 leading-relaxed">{msg.content}</p>

                    {!isUser && msg.evalResult && (
                      <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                        <span className="font-mono text-slate-400">
                          Risk Score: <strong className="text-amber-400">{msg.evalResult.riskScore}%</strong>
                        </span>
                        <span className="text-blue-400 hover:underline flex items-center gap-1">
                          Inspect Guardrails <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sub-column 2: Deep Guardrail Inspection Panel */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-4 flex flex-col h-full overflow-y-auto">
            {activeMessage && activeMessage.evalResult ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                    Guardrail Evaluation Detail
                  </h3>
                  <RiskBadge level={activeMessage.evalResult.riskLevel} size="sm" />
                </div>

                {/* Score & Status Summary */}
                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-mono uppercase">Cumulative Risk</span>
                    <span className="text-lg font-mono font-bold text-slate-100">
                      {activeMessage.evalResult.riskScore}%
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px] font-mono uppercase">Action Taken</span>
                    <span className="text-xs font-mono font-bold text-blue-400">
                      {activeMessage.evalResult.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Highlighted Unsafe Text */}
                <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-lg">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                    Highlighted Phrase Analysis:
                  </span>
                  <HighlightedText
                    text={activeMessage.content}
                    phrases={activeMessage.evalResult.evaluations.flatMap((e) => e.highlightedPhrases)}
                    tooltipText="Violates organizational policy"
                  />
                </div>

                {/* Triggered Guardrails List */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-300 block">
                    Triggered Guardrail Rules ({activeMessage.evalResult.evaluations.length}):
                  </span>
                  {activeMessage.evalResult.evaluations.map((evalItem) => (
                    <div
                      key={evalItem.id}
                      className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200">{evalItem.name}</span>
                        <span className="font-mono text-rose-400 font-bold">{evalItem.riskScore}% Risk</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{evalItem.explanation}</p>
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                        <span>Confidence: {evalItem.confidence}%</span>
                        <span>Category: {evalItem.category}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Safe Rewrite Preview */}
                {activeMessage.evalResult.safeRewrite && (
                  <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block mb-1">
                      Remediated Safe Output:
                    </span>
                    <p className="text-xs font-mono text-emerald-200 leading-relaxed">
                      {activeMessage.evalResult.safeRewrite}
                    </p>
                  </div>
                )}

                {/* Developer Feedback Action */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>Is this evaluation accurate?</span>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 transition-colors">
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-rose-400 transition-colors">
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <ShieldCheck className="w-10 h-10 mb-2 stroke-1 text-slate-600" />
                <p className="text-xs">Select an AI assistant message to inspect its deep guardrail metrics.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
