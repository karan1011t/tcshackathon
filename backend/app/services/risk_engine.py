class RiskEngine:

    # Weight assigned to each guardrail
    WEIGHTS = {
        "Unsafe Content": 40,
        "Bias & Fairness": 20,
        "Confidential Information Leakage": 35,
        "Hallucination": 15,
        "Unsupported Claims": 10
    }

    def calculate(self, guardrails):

        total_score = 0

        triggered = []

        for item in guardrails:

            if item["status"].upper() == "FAIL":

                score = self.WEIGHTS.get(item["name"], 10)

                total_score += score

                triggered.append(item)

        total_score = min(total_score, 100)

        status = "FAIL" if total_score >= 40 else "PASS"

        return {
            "overall_status": status,
            "overall_risk_score": total_score,
            "triggered_guardrails": triggered
        }