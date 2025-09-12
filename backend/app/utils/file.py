from pathlib import Path

def ensure_dir(p: str):
    Path(p).mkdir(parents=True, exist_ok=True)
