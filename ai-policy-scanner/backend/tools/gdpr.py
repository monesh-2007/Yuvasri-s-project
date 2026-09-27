from langchain.tools import tool

@tool
def gdpr_checker(policy_text: str) -> dict:
    """Checks AI policy against GDPR requirements."""
    requirements = [
        "data minimization",
        "purpose limitation",
        "data retention",
        "user consent",
        "right to erasure",
        "data breach notification",
        "data protection officer"
    ]
    gaps = []
    for req in requirements:
        if req.lower() not in policy_text.lower():
            gaps.append(req)
    return {
        "framework": "GDPR",
        "gaps": gaps,
        "passed": len(requirements) - len(gaps),
        "total": len(requirements)
    }