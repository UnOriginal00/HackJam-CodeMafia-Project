from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
import os
import state

# Folder for uploaded files
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOADS_DIR = os.path.join(BASE_DIR, "User_Uploads")
os.makedirs(UPLOADS_DIR, exist_ok=True)

app = FastAPI()

# Track files already indexed
indexed_files = set(os.listdir(UPLOADS_DIR))

# File Upload Endpoint
@app.post("/getfile")
async def getfile(file: UploadFile = File(...)):
    """Save uploaded file and update indexed files list."""
    file_path = os.path.join(UPLOADS_DIR, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())

    new_files = [f for f in os.listdir(UPLOADS_DIR) if f not in indexed_files]
    if new_files:
        indexed_files.update(new_files)

    return {"filename": file.filename, "message": "File received!"}

# User Prompt Endpoint
class UserPrompt(BaseModel):
    prompt: str

@app.post("/user_query")
async def handle_user_query(user_input: UserPrompt):
    """Save the prompt for main.py to process."""
    state.write_prompt(user_input.prompt)
    return {"message": "Prompt received and queued for processing."}

@app.get("/health")
def health_check():
    return {"status": "ok"} 