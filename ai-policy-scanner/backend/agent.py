import os
import json
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def run_compliance_check(policy_text: str) -> dict:
    prompt = f"""You are an AI policy compliance expert. Analyze this AI policy text and return ONLY a JSON object with no extra text.

Policy Text:
{policy_text}

Return this exact JSON structure:
{{
  "summary": {{
    "overall_score": <0-100>,
    "eu_ai_act_score": <0-100>,
    "gdpr_score": <0-100>,
    "transparency_score": <0-100>
  }},
  "gaps": {{
    "eu_ai_act": ["list of missing EU AI Act requirements"],
    "gdpr": ["list of missing GDPR requirements"]
  }},
  "fixes": {{
    "gap name": "suggested clause to add"
  }},
  "status": "<High Risk|Medium Risk|Compliant>"
}}

Check for these EU AI Act requirements: risk classification system, human oversight, transparency obligations, data governance, technical documentation, accuracy and robustness, conformity assessment.
Check for these GDPR requirements: data minimization, purpose limitation, data retention, user consent, right to erasure, data breach notification, data protection officer.
Score based on how many requirements are covered. Return ONLY the JSON."""

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )

    raw = response.choices[0].message.content.strip()
    raw = raw.replace("```json", "").replace("```", "").strip()
    return json.loads(raw)

def scan_policy(policy_text: str) -> str:
    result = run_compliance_check(policy_text)
    return json.dumps(result)

def compare_policies(policy_a: str, policy_b: str, name_a: str, name_b: str) -> dict:
    result_a = run_compliance_check(policy_a)
    result_b = run_compliance_check(policy_b)
    overall_winner = name_a if result_a["summary"]["overall_score"] >= result_b["summary"]["overall_score"] else name_b
    return {
        "policy_a": json.dumps(result_a),
        "policy_b": json.dumps(result_b),
        "names": [name_a, name_b],
        "overall_winner": overall_winner
    }