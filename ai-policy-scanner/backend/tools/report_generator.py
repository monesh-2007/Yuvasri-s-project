from langchain.tools import tool

@tool
def report_generator(eu_result: dict, gdpr_result: dict, scores: dict, fixes: dict) -> dict:
    """Combines all results into a final structured report."""
    return {
        "summary": {
            "overall_score": scores["overall_score"],
            "eu_ai_act_score": scores["eu_ai_act_score"],
            "gdpr_score": scores["gdpr_score"],
            "transparency_score": scores["transparency_score"]
        },
        "gaps": {
            "eu_ai_act": eu_result["gaps"],
            "gdpr": gdpr_result["gaps"]
        },
        "fixes": fixes["fixes"],
        "status": "High Risk" if scores["overall_score"] < 50 else
                  "Medium Risk" if scores["overall_score"] < 75 else "Compliant"
    }