import { create } from "zustand";
import {
  OrganizationInfo,
  Policy,
  DomainPack,
  ConversationSession,
  AuditLogEntry,
  PolicySuggestion,
} from "@/types";
import {
  INITIAL_ORG_INFO,
  INITIAL_POLICIES,
  INITIAL_DOMAIN_PACKS,
  MOCK_CONVERSATIONS,
  MOCK_AUDIT_LOGS,
  MOCK_POLICY_SUGGESTIONS,
} from "@/services/mockData";

export type UserRole = "Admin" | "Developer" | "Security Analyst" | "Compliance Officer";

interface SentinelStore {
  orgInfo: OrganizationInfo;
  policies: Policy[];
  domainPacks: DomainPack[];
  conversations: ConversationSession[];
  auditLogs: AuditLogEntry[];
  suggestions: PolicySuggestion[];
  currentRole: UserRole;

  // Actions
  togglePolicy: (id: string) => void;
  addPolicy: (newPolicy: Omit<Policy, "id" | "version" | "triggerCount" | "updatedAt">) => void;
  deletePolicy: (id: string) => void;
  installDomainPack: (packId: string) => void;
  approveSuggestion: (id: string) => void;
  rejectSuggestion: (id: string) => void;
  addAuditLog: (entry: AuditLogEntry) => void;
  setCurrentRole: (role: UserRole) => void;
  setStrictnessLevel: (level: OrganizationInfo["strictnessLevel"]) => void;
}

export const useSentinelStore = create<SentinelStore>((set) => ({
  orgInfo: INITIAL_ORG_INFO,
  policies: INITIAL_POLICIES,
  domainPacks: INITIAL_DOMAIN_PACKS,
  conversations: MOCK_CONVERSATIONS,
  auditLogs: MOCK_AUDIT_LOGS,
  suggestions: MOCK_POLICY_SUGGESTIONS,
  currentRole: "Admin",

  togglePolicy: (id: string) =>
    set((state) => ({
      policies: state.policies.map((p) =>
        p.id === id ? { ...p, enabled: !p.enabled } : p
      ),
    })),

  addPolicy: (newPolicy) =>
    set((state) => {
      const created: Policy = {
        ...newPolicy,
        id: `pol_${Date.now()}`,
        version: "v1.0",
        triggerCount: 0,
        updatedAt: new Date().toISOString(),
      };
      return {
        policies: [created, ...state.policies],
        orgInfo: {
          ...state.orgInfo,
          activeGuardrailsCount: state.orgInfo.activeGuardrailsCount + 1,
        },
      };
    }),

  deletePolicy: (id: string) =>
    set((state) => ({
      policies: state.policies.filter((p) => p.id !== id),
    })),

  installDomainPack: (packId: string) =>
    set((state) => {
      const targetPack = state.domainPacks.find((p) => p.id === packId);
      if (!targetPack) return state;

      const newPolicies: Policy[] = targetPack.policies.map((p, idx) => ({
        id: `pol_${packId}_${idx}_${Date.now()}`,
        name: p.name,
        description: p.description,
        category: targetPack.category,
        severity: p.severity,
        triggerCondition: p.rule,
        enabled: true,
        version: "v1.0",
        triggerCount: 0,
        updatedAt: new Date().toISOString(),
      }));

      return {
        domainPacks: state.domainPacks.map((p) =>
          p.id === packId ? { ...p, installed: true } : p
        ),
        policies: [...newPolicies, ...state.policies],
      };
    }),

  approveSuggestion: (id: string) =>
    set((state) => {
      const sug = state.suggestions.find((s) => s.id === id);
      if (!sug) return state;

      const createdPolicy: Policy = {
        id: `pol_sug_${Date.now()}`,
        name: `Adaptive: ${sug.suggestedRule.slice(0, 30)}...`,
        description: sug.reason,
        category: "Enterprise",
        severity: "medium",
        triggerCondition: sug.suggestedRule,
        enabled: true,
        version: "v1.0",
        triggerCount: 0,
        updatedAt: new Date().toISOString(),
      };

      return {
        suggestions: state.suggestions.map((s) =>
          s.id === id ? { ...s, status: "approved" } : s
        ),
        policies: [createdPolicy, ...state.policies],
      };
    }),

  rejectSuggestion: (id: string) =>
    set((state) => ({
      suggestions: state.suggestions.map((s) =>
        s.id === id ? { ...s, status: "rejected" } : s
      ),
    })),

  addAuditLog: (entry: AuditLogEntry) =>
    set((state) => ({
      auditLogs: [entry, ...state.auditLogs],
      orgInfo: {
        ...state.orgInfo,
        totalRequestsToday: state.orgInfo.totalRequestsToday + 1,
      },
    })),

  setCurrentRole: (role: UserRole) => set({ currentRole: role }),

  setStrictnessLevel: (level) =>
    set((state) => ({
      orgInfo: { ...state.orgInfo, strictnessLevel: level },
    })),
}));
