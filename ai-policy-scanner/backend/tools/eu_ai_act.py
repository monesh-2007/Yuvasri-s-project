
from langchain.tools import tool

@tool
def eu_ai_act_checker(policy_text: str) -> dict:
    """Checks AI policy against EU AI Act requirements."""
    requirements = [
        "risk classification system",
        "human oversight",
        "transparency obligations",
        "data governance",
        "technical documentation",
        "accuracy and robustness",
        "conformity assessment"
    ]
    gaps = []
    for req in requirements:
        if req.lower() not in policy_text.lower():
            gaps.append(req)
    return {
        "framework": "EU AI Act",
        "gaps": gaps,
        "passed": len(requirements) - len(gaps),
        "total": len(requirements)
    }