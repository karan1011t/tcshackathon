from pydantic import BaseModel
from typing import List


class GuardrailResult(BaseModel):
    name: str
    status: str
    severity: str
    explanation: str
    highlighted_phrase: str


class EvaluationResponse(BaseModel):
    overall_status: str
    overall_risk_score: int
    explanation: str
    safe_response: str
    guardrails: List[GuardrailResult]