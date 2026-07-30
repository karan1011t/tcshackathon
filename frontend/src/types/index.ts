export type RiskLevel = 'safe' | 'medium' | 'high' | 'critical';

export type PolicyCategory = 'Healthcare' | 'Finance' | 'Legal' | 'Education' | 'Enterprise' | 'Security';

export interface GuardrailEvaluation {
  id: string;
  name: string;
  description: string;
  weight: number;
  status: 'pass' | 'fail' | 'warning';
  riskScore: number; // 0 - 100
  confidence: number; // 0 - 100
  explanation: string;
  highlightedPhrases: string[];
  category: PolicyCategory;
}

export interface Policy {
  id: string;
  name: string;
  description: string;
  category: PolicyCategory;
  severity: 'low' | 'medium' | 'high' | 'critical';
  triggerCondition: string;
  enabled: boolean;
  version: string;
  triggerCount: number;
  customRewriteRule?: string;
  updatedAt: string;
}

export interface DomainPack {
  id: string;
  name: string;
  description: string;
  category: PolicyCategory;
  policiesCount: number;
  installed: boolean;
  policies: Array<{
    name: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    rule: string;
  }>;
}

export interface ConversationMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  evalResult?: {
    riskScore: number;
    riskLevel: RiskLevel;
    evaluations: GuardrailEvaluation[];
    safeRewrite?: string;
    status: 'passed' | 'rewritten' | 'blocked';
  };
}

export interface ConversationSession {
  id: string;
  title: string;
  userName: string;
  startedAt: string;
  messages: ConversationMessage[];
  maxRiskLevel: RiskLevel;
  status: 'active' | 'flagged' | 'resolved';
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  prompt: string;
  response: string;
  riskScore: number;
  riskLevel: RiskLevel;
  actionTaken: 'rewritten' | 'passed' | 'blocked';
  triggeredGuardrails: string[];
  policyVersion: string;
  orgId: string;
  safeRewrite: string;
  latencyMs: number;
}

export interface PolicySuggestion {
  id: string;
  triggeredBy: string;
  suggestedRule: string;
  reason: string;
  confidence: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface OrganizationInfo {
  id: string;
  name: string;
  industry: string;
  activeGuardrailsCount: number;
  overallSafetyScore: number;
  totalRequestsToday: number;
  strictnessLevel: 'Permissive' | 'Balanced' | 'Strict' | 'Paranoid';
}
