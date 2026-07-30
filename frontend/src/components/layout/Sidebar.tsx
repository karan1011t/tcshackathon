"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Activity,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Package,
  BarChart3,
  FileSpreadsheet,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { useSentinelStore } from "@/store/useSentinelStore";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Live Monitor", href: "/monitor", icon: Activity, badge: "LIVE" },
  { label: "Live Chat Sandbox", href: "/chat-demo", icon: Sparkles, badge: "DEMO" },
  { label: "Conversations", href: "/conversations", icon: MessageSquare },
  { label: "Explainability", href: "/explainability", icon: Sparkles },
  { label: "Policy Manager", href: "/policies", icon: ShieldCheck },
  { label: "Domain Packs", href: "/domain-packs", icon: Package },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Audit Logs", href: "/audit", icon: FileSpreadsheet },
  { label: "Settings", href: "/settings", icon: Settings },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { orgInfo, currentRole } = useSentinelStore();

  return (
    <aside
      className={`relative flex flex-col h-screen bg-slate-950 border-r border-slate-800/80 transition-all duration-300 z-20 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800/80">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-slate-100 tracking-tight leading-none font-sans">
                Sentinel<span className="text-blue-500">AI</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase mt-1">
                Guardrail Middleware
              </span>
            </div>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
          aria-label="Toggle sidebar collapse"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900"
              } ${collapsed ? "justify-center" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-blue-400" : "text-slate-400"}`} />
              {!collapsed && (
                <span className="flex-1 truncate">{item.label}</span>
              )}
              {!collapsed && item.badge && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold font-mono text-emerald-400 bg-emerald-500/15 rounded border border-emerald-500/30 animate-pulse">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Role & Org Info */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
        {!collapsed ? (
          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Safety Score
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {orgInfo.overallSafetyScore}%
              </span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full"
                style={{ width: `${orgInfo.overallSafetyScore}%` }}
              />
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
              <span>Role: <strong className="text-slate-200">{currentRole}</strong></span>
              <span className="font-mono text-blue-400">{orgInfo.strictnessLevel}</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center p-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" title="Safety Status: 94.2% Safe" />
          </div>
        )}
      </div>
    </aside>
  );
};
