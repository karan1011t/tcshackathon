from app.database.mock_db import (
    get_core_policies,
    get_org_rules
)

from app.utils.groq_client import evaluate_response


class GuardrailEngine:

    def __init__(self, organization="Default"):

        self.organization = organization

        self.core_policies = get_core_policies()

        self.organization_rules = get_org_rules(organization)

    def build_policy_prompt(self):

        prompt = "Core Guardrails:\n"

        for policy in self.core_policies:

            if policy["enabled"]:

                prompt += f"""
- {policy['name']}
Severity: {policy['severity']}
Weight: {policy['weight']}
"""

        prompt += "\nOrganization Policies:\n"

        for rule in self.organization_rules:

            prompt += f"""
- {rule['rule']}
Severity: {rule['severity']}
"""

        return prompt

    def evaluate(self, prompt, chatbot_response):

        policy_prompt = self.build_policy_prompt()

        result = evaluate_response(
            prompt=prompt,
            response=chatbot_response,
            policies=policy_prompt
        )

        return result