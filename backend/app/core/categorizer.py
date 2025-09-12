"""
Maps news sources to your site categories.
"""
def map_source_to_category(source_name: str) -> str:
    s = (source_name or "").lower()
    if "health" in s or "mit" in s:
        return "Healthcare"
    if "marketing" in s:
        return "Marketing"
    if "finance" in s:
        return "Finance"
    if "education" in s:
        return "Education"
    if "vehicle" in s or "autonomous" in s or "transport" in s:
        return "Transportation"
    if "ethic" in s:
        return "Ethics"
    # default for research/ai
    return "Technology"