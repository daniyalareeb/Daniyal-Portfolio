def safe_truncate(text: str, n: int) -> str:
    return (text[: n - 3] + "...") if len(text) > n else text
