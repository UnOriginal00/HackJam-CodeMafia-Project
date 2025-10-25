STATE_FILE = "latest_user_input.json"

def write_prompt(prompt: str):
    """Save the latest user prompt to JSON."""
    import json
    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump({"prompt": prompt}, f)

def read_prompt():
    """Read the latest prompt. Remove the file after reading to avoid duplicates."""
    import json, os
    if not os.path.exists(STATE_FILE):
        return None
    with open(STATE_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    os.remove(STATE_FILE)
    return data.get("prompt")
