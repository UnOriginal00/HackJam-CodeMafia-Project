from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
import os
import state # Update latest_user_input when receiving input




app = FastAPI()

# Absolute path to your upload folder
User_Uploads = r"C:\Users\mutsa\OneDrive\Desktop\MYDesk_AI\User_Uploads"  # Change this to user_uploads
os.makedirs(User_Uploads, exist_ok=True)

#---------------------File Upload section-------------------------------

# Endpoint to handle file uploads
@app.post("/getfile")

# Define the function to handle file uploads
async def getfile(file: UploadFile = File(...)):
    # Save the uploaded file to the User_Uploads folder
    file_path = os.path.join(User_Uploads, file.filename)
    
    #Open the file in write-binary mode and write the contents of the uploaded file to it
    with open(file_path, "wb") as f:
        f.write(await file.read())

    # Confirm the file was received
    return {
        "filename": file.filename,
        "message": "File received successfully!"
    }



#-------------UserPrompt------------------------




class UserPrompt(BaseModel):
    prompt: str

@app.post("/user_query")
async def handle_user_query(user_input: UserPrompt):
    state.write_prompt(user_input.prompt)  # write to JSON file
    return {"message": "Prompt received"}



