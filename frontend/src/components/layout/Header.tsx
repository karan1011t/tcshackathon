"use client";

import React, { useState } from "react";
import {
  Building2,
  Search,
  Bell,
  User,
  CheckCircle2,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { useSentinelStore, UserRole } from "@/store/useSentinelStore";

export const Header: React.FC = () => {
  const { orgInfo, currentRole, setCurrentRole } = useSentinelStore();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showOrgMenu, setShowOrgMenu] = useState(false);

  const roles: UserRole[] = ["Admin", "Developer", "Security Analyst", "Compliance Officer"];

  return (
    <header className="h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-10">
      {/* Left: Org Selector & Search */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setShowOrgMenu(!showOrgMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 hover:border-slate-700 transition-colors"
          >
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            <span className="max-w-[180px] truncate">{orgInfo.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showOrgMenu && (
            <div className="absolute left-0 mt-1 w-64 bg-slate-900 border border-slate-800 rounded-lg shadow-xl p-2 z-50">
              <div className="px-2 py-1 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                Select Organization
              </div>
              <button
                onClick={() => setShowOrgMenu(false)}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-md bg-blue-600/10 border border-blue-500/30 text-xs font-medium text-blue-300"
              >
                <span>{orgInfo.name}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              </button>
              <button
                onClick={() => setShowOrgMenu(false)}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-md text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-200 mt-1"
              >
                <span>Acme FinTech Middleware</span>
              </button>
            </div>
          )}
        </div>

        {/* Global Search Bar */}
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search guardrails, audit logs, policies... (⌘K)"
            className="w-72 bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors font-sans"
          />
        </div>
      </div>

      {/* Right: Telemetry status, Role selector, Notifications, Profile */}
      <div className="flex items-center gap-3">
        {/* System Active Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5 animate-pulse" />
          <span>GUARDRAIL PIPELINE ACTIVE</span>
        </div>

        {/* Role Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-slate-100 hover:border-slate-700 transition-colors"
          >
            <span className="text-slate-400">Role:</span>
            <span className="font-semibold text-blue-400">{currentRole}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-1 w-48 bg-slate-900 border border-slate-800 rounded-lg shadow-xl p-1 z-50">
              <div className="px-2.5 py-1 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                Switch Perspective
              </div>
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setCurrentRole(r);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors flex items-center justify-between ${
                    currentRole === r
                      ? "bg-blue-600/20 text-blue-300 font-semibold"
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  }`}
                >
                  <span>{r}</span>
                  {currentRole === r && <CheckCircle2 className="w-3 h-3 text-blue-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
        </button>

        {/* User Profile Avatar */}
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-slate-100 font-bold text-xs shadow-md">
          <User className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
};
