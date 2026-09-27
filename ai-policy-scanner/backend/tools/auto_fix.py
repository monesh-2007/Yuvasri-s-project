from langchain.tools import tool

FIX_SUGGESTIONS = {
    "data retention": "Add: 'Personal data will be retained only for as long as necessary to fulfil the stated purpose and deleted thereafter.'",
    "user consent": "Add: 'We obtain explicit informed consent from users before processing their personal data.'",
    "human oversight": "Add: 'All high-risk AI decisions are subject to human review before being actioned.'",
    "transparency obligations": "Add: 'Users will be informed when they are interacting with an AI system.'",
    "risk classification system": "Add: 'Our AI systems are classified according to EU AI Act risk tiers: minimal, limited, high, or unacceptable.'",
    "data minimization": "Add: 'We collect only the minimum data necessary for the specified purpose.'",
    "right to erasure": "Add: 'Users have the right to request deletion of their personal data at any time.'",
    "data breach notification": "Add: 'In the event of a data breach, affected users will be notified within 72 hours.'",
    "data governance": "Add: 'We maintain documented data governance procedures covering collection, storage, and usage.'",
    "technical documentation": "Add: 'Technical documentation for all AI systems is maintained and available upon request.'",
    "data protection officer": "Add: 'A Data Protection Officer has been appointed and can be contacted at dpo@company.com.'",
    "accuracy and robustness": "Add: 'Our AI systems are regularly tested for accuracy, reliability, and robustness against adversarial inputs.'",
    "conformity assessment": "Add: 'High-risk AI systems undergo third-party conformity assessment before deployment.'",
    "purpose limitation": "Add: 'Data collected for one purpose will not be used for any other incompatible purpose without consent.'"
}

@tool
def auto_fix_generator(gaps: list) -> dict:
    """Generates fix suggestions for each compliance gap."""
    suggestions = {}
    for gap in gaps:
        suggestions[gap] = FIX_SUGGESTIONS.get(
            gap, f"Add a clear policy clause addressing: '{gap}'"
        )
    return {"fixes": suggestions}