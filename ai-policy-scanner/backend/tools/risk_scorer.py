from langchain.tools import tool

@tool
def risk_scorer(eu_gaps: list, gdpr_gaps: list, policy_text: str) -> dict:
    """Calculates risk scores per category."""
    def score(gaps, total):
        return round(((total - len(gaps)) / total) * 100)

    transparency_keywords = ["explain", "transparent", "disclose", "notify", "inform"]
    transparency_score = sum(
        1 for k in transparency_keywords if k in policy_text.lower()
    )

    return {
        "eu_ai_act_score": score(eu_gaps, 7),
        "gdpr_score": score(gdpr_gaps, 7),
        "transparency_score": min(round((transparency_score / len(transparency_keywords)) * 100), 100),
        "overall_score": round(
            (score(eu_gaps, 7) + score(gdpr_gaps, 7)) / 2
        )
    }