from langchain.tools import tool

@tool
def policy_comparator(scores_a: dict, scores_b: dict, name_a: str, name_b: str) -> dict:
    """Compares two policies and declares a winner per category."""
    comparison = {}
    for key in scores_a:
        a_val = scores_a[key]
        b_val = scores_b[key]
        winner = name_a if a_val >= b_val else name_b
        comparison[key] = {
            name_a: a_val,
            name_b: b_val,
            "winner": winner
        }
    overall_winner = name_a if scores_a["overall_score"] >= scores_b["overall_score"] else name_b
    return {
        "comparison": comparison,
        "overall_winner": overall_winner
    }