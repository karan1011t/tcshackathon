from fastapi import APIRouter

from app.models.request import EvaluationRequest
from app.services.guardrail_engine import GuardrailEngine
from app.services.risk_engine import RiskEngine
from app.services.rewrite_engine import RewriteEngine
from app.database.mock_db import save_log

router = APIRouter()

risk_engine = RiskEngine()
rewrite_engine = RewriteEngine()


@router.post("/evaluate")
def evaluate(request: EvaluationRequest):

    guardrail = GuardrailEngine(request.organization)

    ai_result = guardrail.evaluate(
        request.prompt,
        request.response
    )

    risk = risk_engine.calculate(
        ai_result["guardrails"]
    )

    safe_response = request.response

    if risk["overall_status"] == "FAIL":

        safe_response = rewrite_engine.rewrite(
            request.response
        )

    result = {
        "overall_status": risk["overall_status"],
        "overall_risk_score": risk["overall_risk_score"],
        "overall_explanation": ai_result["overall_explanation"],
        "safe_response": safe_response,
        "guardrails": ai_result["guardrails"]
    }

    save_log(result)

    return result