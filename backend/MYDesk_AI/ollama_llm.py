import requests
import json
import re

OLLAMA_SERVER_URL = "http://localhost:11434/api/generate"

def generate_summary(prompt: str, context: str = "", model: str = "tinyllama", max_tokens: int = 512) -> str:
    payload = {
        "model": model,
        "prompt": f"{context}\n\nUser Prompt: {prompt}",
        "max_tokens": max_tokens
    }

    try:
        response = requests.post(OLLAMA_SERVER_URL, json=payload)
        response.raise_for_status()

        # Try parsing JSON response
        try:
            result = json.loads(response.text)
            text = result.get("text", "")
        except json.JSONDecodeError:
            text = response.text.strip()

        # ----- CLEANUP SECTION -----
        # Remove any numbers that appear like embeddings or token IDs
        text = re.sub(r"\[\d+(?:,\s*\d+)*\]", "", text)

        # Normalize whitespace and line breaks
        text = re.sub(r"\n{2,}", "\n", text)   # multiple blank lines -> single
        text = text.strip()

        return text

    except requests.exceptions.RequestException as e:
        print(f"[ERROR] Ollama request failed: {e}")
        return ""
