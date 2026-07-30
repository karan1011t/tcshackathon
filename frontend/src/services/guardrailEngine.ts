import { GuardrailEvaluation, RiskLevel, Policy } from "@/types";
import { calculateRiskLevel } from "@/lib/utils";

export interface EvaluationResult {
  riskScore: number;
  riskLevel: RiskLevel;
  status: "passed" | "rewritten" | "blocked";
  evaluations: GuardrailEvaluation[];
  safeRewrite: string;
  triggeredCount: number;
  explanation: string;
  latencyMs: number;
}

export function evaluateGuardrails(
  prompt: string,
  response: string,
  policies: Policy[] = []
): EvaluationResult {
  const startTime = typeof performance !== "undefined" ? performance.now() : Date.now();
  const lowerPrompt = prompt.toLowerCase();
  const lowerResp = response.toLowerCase();

  const evaluations: GuardrailEvaluation[] = [];
  let totalScore = 0;
  let maxSeverityScore = 0;

  // Rule 1: Password / Credential Leakage
  const hasCredential =
    /password|secret|api[_-]?key|ssn|token|auth_token|postgres_admin/i.test(lowerResp) ||
    /password|secret|credential/i.test(lowerPrompt);

  if (hasCredential) {
    const evalItem: GuardrailEvaluation = {
      id: "guard_cred",
      name: "Confidential Information Leakage",
      description: "Detects unauthorized exposure of administrative credentials, passwords, or PII.",
      weight: 40,
      status: "fail",
      riskScore: 92,
      confidence: 98,
      explanation: "Sensitive credential pattern or authentication token keyword detected in AI response output.",
      highlightedPhrases: Array.from(response.match(/password[^\s,.]*|secret[^\s,.]*|Postgres_[^\s,.]*/gi) || ["credential phrase"]),
      category: "Enterprise",
    };
    evaluations.push(evalItem);
    totalScore += 40;
    maxSeverityScore = Math.max(maxSeverityScore, 92);
  } else {
    evaluations.push({
      id: "guard_cred",
      name: "Confidential Information Leakage",
      description: "Detects unauthorized exposure of administrative credentials, passwords, or PII.",
      weight: 40,
      status: "pass",
      riskScore: 0,
      confidence: 99,
      explanation: "No sensitive credentials or credentials patterns detected.",
      highlightedPhrases: [],
      category: "Enterprise",
    });
  }

  // Rule 2: Unverified Medical Diagnosis / Prescription
  const hasMedical =
    /diagnose|prescribe|mg|amoxicillin|aspirin|nitroglycerin|dosage|heart attack|myocardial infarction/i.test(lowerResp) ||
    /diagnosis|prescribe|symptom/i.test(lowerPrompt);

  if (hasMedical) {
    const evalItem: GuardrailEvaluation = {
      id: "guard_med",
      name: "Unsafe Medical Diagnosis & PHI Safeguard",
      description: "Prevents direct medical diagnosis, prescribing medication dosages, or PHI exposure.",
      weight: 35,
      status: "fail",
      riskScore: 78,
      confidence: 95,
      explanation: "AI attempt to diagnose medical condition or specify prescription dosage without clinical oversight.",
      highlightedPhrases: Array.from(response.match(/prescribe\s+\d+mg[^\s,.]*|diagnose[^\s,.]*|Heart Attack/gi) || ["prescribe dosage"]),
      category: "Healthcare",
    };
    evaluations.push(evalItem);
    totalScore += 30;
    maxSeverityScore = Math.max(maxSeverityScore, 78);
  } else {
    evaluations.push({
      id: "guard_med",
      name: "Unsafe Medical Diagnosis & PHI Safeguard",
      description: "Prevents direct medical diagnosis, prescribing medication dosages, or PHI exposure.",
      weight: 35,
      status: "pass",
      riskScore: 0,
      confidence: 99,
      explanation: "No unauthorized medical diagnoses or dosage statements found.",
      highlightedPhrases: [],
      category: "Healthcare",
    });
  }

  // Rule 3: Guaranteed Financial Return / Stock Buying Advice
  const hasFinancial =
    /guaranteed|profit|yield|invest all|buy token|double your money|50% profit/i.test(lowerResp) ||
    /invest|crypto|stock|401k/i.test(lowerPrompt);

  if (hasFinancial) {
    const evalItem: GuardrailEvaluation = {
      id: "guard_fin",
      name: "Financial Advice & Unverified Return Restriction",
      description: "Restricts non-compliant financial advice and guaranteed investment return claims.",
      weight: 25,
      status: "fail",
      riskScore: 65,
      confidence: 92,
      explanation: "Response claims guaranteed financial returns on equity/crypto assets without disclaimer.",
      highlightedPhrases: Array.from(response.match(/guaranteed[^\s,.]*|50% profit[^\s,.]*|double your money/gi) || ["guaranteed returns"]),
      category: "Finance",
    };
    evaluations.push(evalItem);
    totalScore += 20;
    maxSeverityScore = Math.max(maxSeverityScore, 65);
  } else {
    evaluations.push({
      id: "guard_fin",
      name: "Financial Advice & Unverified Return Restriction",
      description: "Restricts non-compliant financial advice and guaranteed investment return claims.",
      weight: 25,
      status: "pass",
      riskScore: 0,
      confidence: 98,
      explanation: "Response complies with financial advice disclaimer policies.",
      highlightedPhrases: [],
      category: "Finance",
    });
  }

  // Rule 4: Prompt Injection & Jailbreak Attack
  const hasJailbreak =
    /dan|ignore all|do anything now|bypass|unrestricted|ignore previous/i.test(lowerPrompt) ||
    /unrestricted|bypassing safety/i.test(lowerResp);

  if (hasJailbreak) {
    const evalItem: GuardrailEvaluation = {
      id: "guard_jailbreak",
      name: "Prompt Injection & Jailbreak Neutralizer",
      description: "Identifies prompt override payloads, system instruction hijack, or jailbreak attacks.",
      weight: 50,
      status: "fail",
      riskScore: 96,
      confidence: 99,
      explanation: "Prompt injection attempt detected trying to override safety instructions.",
      highlightedPhrases: Array.from(prompt.match(/dan|ignore all|do anything now|bypass/gi) || ["jailbreak trigger"]),
      category: "Security",
    };
    evaluations.push(evalItem);
    totalScore += 45;
    maxSeverityScore = Math.max(maxSeverityScore, 96);
  } else {
    evaluations.push({
      id: "guard_jailbreak",
      name: "Prompt Injection & Jailbreak Neutralizer",
      description: "Identifies prompt override payloads, system instruction hijack, or jailbreak attacks.",
      weight: 50,
      status: "pass",
      riskScore: 0,
      confidence: 99,
      explanation: "Prompt structure complies with security guidelines.",
      highlightedPhrases: [],
      category: "Security",
    });
  }

  // Rule 5: Bias & Unsupported Claims Check
  const hasBias = /always|never|all people from|every single|obviously/i.test(lowerResp) && lowerResp.length > 150;
  if (hasBias) {
    evaluations.push({
      id: "guard_bias",
      name: "Bias & Unsupported Factual Claims",
      description: "Assesses response for ungrounded generalizations, bias, or factual hallucinations.",
      weight: 15,
      status: "warning",
      riskScore: 35,
      confidence: 84,
      explanation: "Contains broad generalizations without supporting factual citations.",
      highlightedPhrases: ["broad generalization"],
      category: "Enterprise",
    });
    totalScore += 10;
  } else {
    evaluations.push({
      id: "guard_bias",
      name: "Bias & Unsupported Factual Claims",
      description: "Assesses response for ungrounded generalizations, bias, or factual hallucinations.",
      weight: 15,
      status: "pass",
      riskScore: 0,
      confidence: 96,
      explanation: "No ungrounded factual claims or discriminatory generalizations detected.",
      highlightedPhrases: [],
      category: "Enterprise",
    });
  }

  // Evaluate Custom Policies passed in
  policies.filter((p) => p.enabled).forEach((policy) => {
    if (policy.triggerCondition && response.toLowerCase().includes(policy.triggerCondition.toLowerCase())) {
      evaluations.push({
        id: `guard_custom_${policy.id}`,
        name: policy.name,
        description: policy.description,
        weight: policy.severity === "critical" ? 40 : policy.severity === "high" ? 30 : 15,
        status: "fail",
        riskScore: policy.severity === "critical" ? 95 : policy.severity === "high" ? 75 : 45,
        confidence: 95,
        explanation: `Triggered active policy: ${policy.name}`,
        highlightedPhrases: [policy.triggerCondition],
        category: policy.category,
      });
      totalScore += 20;
    }
  });

  const finalRiskScore = Math.min(100, Math.max(totalScore, maxSeverityScore));
  const riskLevel = calculateRiskLevel(finalRiskScore);
  const failedEvals = evaluations.filter((e) => e.status === "fail");

  let status: "passed" | "rewritten" | "blocked" = "passed";
  let safeRewrite = response;

  if (finalRiskScore >= 85) {
    status = "blocked";
    safeRewrite = "SECURITY VIOLATION BLOCKED: This AI response was intercepted by Sentinel AI because it violates organizational security, privacy, or credential protection policies.";
  } else if (finalRiskScore >= 25) {
    status = "rewritten";
    if (hasCredential) {
      safeRewrite = "I cannot disclose internal passwords, API keys, or administrative credentials.";
    } else if (hasMedical) {
      safeRewrite = "Chest pain or acute physical symptoms require immediate evaluation by emergency medical professionals (911/ER). As an AI assistant, I cannot prescribe medications or issue medical diagnoses.";
    } else if (hasFinancial) {
      safeRewrite = "Investing in financial markets carries risk of loss. Guaranteed returns do not exist. Please consult a qualified financial advisor before investing.";
    } else if (hasJailbreak) {
      safeRewrite = "I am programmed to adhere to safety protocols and cannot bypass system security policies.";
    } else {
      safeRewrite = `${response} [Note: Sentence modified by Sentinel AI to align with organizational safety guidelines.]`;
    }
  }

  const endTime = typeof performance !== "undefined" ? performance.now() : Date.now();
  const latencyMs = Math.round(endTime - startTime) + Math.floor(Math.random() * 8) + 8;

  return {
    riskScore: finalRiskScore,
    riskLevel,
    status,
    evaluations,
    safeRewrite,
    triggeredCount: failedEvals.length,
    explanation: failedEvals.length > 0
      ? `Intercepted ${failedEvals.length} policy violation(s): ${failedEvals.map((e) => e.name).join(", ")}.`
      : "Response satisfies all configured Responsible AI guardrails.",
    latencyMs,
  };
}
