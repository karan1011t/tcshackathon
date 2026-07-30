from fastapi import APIRouter

from app.services.policy_engine import PolicyEngine

router = APIRouter()

engine = PolicyEngine()


@router.get("/{organization}")
def get_policies(organization: str):

    return engine.get(organization)


@router.post("/")
def add_policy(rule: dict):

    return engine.create(rule)


@router.delete("/{rule_id}")
def delete_policy(rule_id: int):

    engine.delete(rule_id)

    return {
        "message": "Policy Deleted"
    }