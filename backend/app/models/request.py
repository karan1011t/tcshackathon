from pydantic import BaseModel


class EvaluationRequest(BaseModel):
    prompt: str
    response: str
    organization: str = "Default"