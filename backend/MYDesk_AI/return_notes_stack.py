import os
import json
import requests

# Configuration 
RAG_FOLDER = r"C:\HackJam-CodeMafia-Project\backend\MYDesk_AI\RAG_Responses"
CSHARP_API_URL = "http://10.26.71.94:5000/api/ai/upload"  # I need this to be changed to the c# end point (Backend unit, please update accordingly)


# Load all RAG responses into a stack (newest first) (Followed the Last In First Out principle{LIFO})
def load_rag_stack(folder_path):
    if not os.path.exists(folder_path):
        raise FileNotFoundError(f"Folder not found: {folder_path}")

    stack = []
    files = sorted(
        [f for f in os.listdir(folder_path) if f.endswith(".json")],
        reverse=True  # newest files on top
    )

    for file in files:
        file_path = os.path.join(folder_path, file)
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                stack.append(data)
        except Exception as e:
            print(f"[WARN] Could not read {file}: {e}")
    return stack


# Send the latest note to C# backend 
def send_latest_to_csharp(stack, api_url):
    if not stack:
        print("[INFO] No RAG responses to send.")
        return

    latest_note = stack.pop(0)  # newest note on top
    headers = {"Content-Type": "application/json"}

    try:
        response = requests.post(api_url, json=latest_note, headers=headers)
        if response.status_code == 200:
            print(f"[SUCCESS] Sent latest note ({latest_note['timestamp']}) to C# API ✅")
        else:
            print(f"[ERROR] Failed to send note. Status: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"[ERROR] Could not send note to C# API: {e}")


# Main execution 
if __name__ == "__main__":
    rag_stack = load_rag_stack(RAG_FOLDER)
    print(f"Loaded {len(rag_stack)} RAG responses into stack.")

    # Send the latest note to C# backend
    send_latest_to_csharp(rag_stack, CSHARP_API_URL)

    print(f"Remaining notes in stack: {len(rag_stack)}")
