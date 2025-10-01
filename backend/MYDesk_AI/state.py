STATE_FILE = "latest_user_input.json"

def write_prompt(prompt: str):
    import json
    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump({"prompt": prompt}, f)

def read_prompt():
    import json, os
    if not os.path.exists(STATE_FILE):
        return None
    with open(STATE_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    # Reset the file so main.py doesn’t process same prompt again
    os.remove(STATE_FILE)
    return data.get("prompt")