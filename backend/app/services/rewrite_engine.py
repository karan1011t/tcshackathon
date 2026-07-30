from app.utils.groq_client import get_client
from app.config import MODEL_NAME


class RewriteEngine:

    def rewrite(self, original_response):

        client = get_client()

        completion = client.chat.completions.create(
            model=MODEL_NAME,
            temperature=0.2,
            messages=[
                {
                    "role": "system",
                    "content": """Rewrite the chatbot response so it becomes safe, professional and policy compliant. Return ONLY the rewritten response."""
                },
                {
                    "role": "user",
                    "content": original_response
                }
            ]
        )

        return completion.choices[0].message.content