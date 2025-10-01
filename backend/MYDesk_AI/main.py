import os
import json
import torch
import fitz
import textwrap
import pandas as pd
import numpy as np
from datetime import datetime
from spacy.lang.en import English
from sentence_transformers import SentenceTransformer, util
import state
from ollama_llm import generate_summary

UPLOAD_FOLDER = r"C:\Users\mutsa\OneDrive\Desktop\MYDesk_AI\User_Uploads"
USER_NOTES_FOLDER = r"C:\Users\mutsa\OneDrive\Desktop\MYDesk_AI\User_Notes"
CSV_PATH = r"C:\Users\mutsa\OneDrive\Desktop\MYDesk_AI\text.chunks_and_embeddings_df.csv"
os.makedirs(USER_NOTES_FOLDER, exist_ok=True)

# Initialize NLP and embedding model
nlp = English()
nlp.add_pipe("sentencizer")
device = "cuda" if torch.cuda.is_available() else "cpu"
embedding_model = SentenceTransformer("all-mpnet-base-v2", device=device)


#Now this function is important every time, everytime the prompt is entered instead of going throught the whole process of embedding the program will look through the vector database
#The vector database at the moment is the csv, I'll get a real vector databse after I have tested the code.

# Load existing embeddings if CSV exists and is not empty
pages_and_chunks = []

if os.path.exists(CSV_PATH) and os.path.getsize(CSV_PATH) > 0:
    try:
        df_chunks = pd.read_csv(CSV_PATH)
        if not df_chunks.empty:
            pages_and_chunks = df_chunks.to_dict(orient="records")
            # Convert embeddings from string to numpy arrays
            for item in pages_and_chunks:
                item["chunk_embedding"] = np.array(json.loads(item["chunk_embedding"]))
            print(f"[INFO] Loaded {len(pages_and_chunks)} chunks from CSV")
        else:
            print("[INFO] CSV exists but is empty. Will process PDFs...")
    except pd.errors.EmptyDataError:
        print("[INFO] CSV exists but could not be read. Will process PDFs...")
else:
    print("[INFO] No existing CSV found. Will process PDFs...")

# Process new PDFs if needed
existing_files = {item["File"] for item in pages_and_chunks} if pages_and_chunks else set()
all_pages = []

for filename in os.listdir(UPLOAD_FOLDER):
    if not filename.lower().endswith(".pdf") or filename in existing_files:
        continue
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    print(f"[INFO] Processing new PDF: {filename}")
    doc = fitz.open(file_path)
    for page_num, page in enumerate(doc):
        text = page.get_text().replace("\n", " ").strip()
        all_pages.append({"File": filename, "Page_Number": page_num, "Text": text})

# Split new pages into sentence chunks and embed
num_sentences_per_chunk = 10
for item in all_pages:
    sentences = [str(s).strip() for s in nlp(item["Text"]).sents if str(s).strip()]
    for i in range(0, len(sentences), num_sentences_per_chunk):
        chunk = sentences[i:i + num_sentences_per_chunk]
        joined_chunk = " ".join(chunk)
        chunk_embedding = embedding_model.encode(joined_chunk, convert_to_tensor=True).cpu().numpy()
        pages_and_chunks.append({
            "File": item["File"],
            "Page_Number": item["Page_Number"],
            "sentence_chunk": joined_chunk,
            "chunk_embedding": chunk_embedding
        })

# Save all chunks and embeddings to CSV
for item in pages_and_chunks:
    item["chunk_embedding"] = json.dumps(item["chunk_embedding"].tolist())

df_save = pd.DataFrame(pages_and_chunks)
df_save.to_csv(CSV_PATH, index=False)
print(f"[INFO] Saved {len(pages_and_chunks)} chunks to CSV at {CSV_PATH}")

# Convert embeddings to tensor for semantic search
embeddings = torch.tensor(
    np.stack([np.array(json.loads(item["chunk_embedding"])) for item in pages_and_chunks], axis=0),
    dtype=torch.float32
).to(device)

print("[INFO] Ready to process user queries...")



#/////////////////////////////////////////////////////////////////////User_iNPUT///////////////////////////////////////////////////////////////////////////////
#If you noticed the user_input is in a loop i need it to be like that becuase in this section the user input 
# and the pages and chunks are together so everytime a user put in a new prompt it automaitaclly generates info.

# User input loop
while True:
    query = state.read_prompt()  # read from JSON file
    if query:
       
        print(f"[INFO] New user input received: {query}")

        user_embedding = embedding_model.encode(query, convert_to_tensor=True).to(device)
        dot_scores = util.dot_score(user_embedding, embeddings)[0]
        top_results = torch.topk(dot_scores, k=10)

        def print_wrapped(text, wrap_length=80):
            print(textwrap.fill(text, wrap_length))

        print("\nTop 10 relevant chunks:")
        for score, idx in zip(top_results[0], top_results[1]):
            chunk_text = pages_and_chunks[idx]["sentence_chunk"]
            page_number = pages_and_chunks[idx]["Page_Number"]
            print(f"\nScore: {score:.6f} | Page: {page_number}")
            print_wrapped(chunk_text)

        # Generate summary
        top_chunks_text = " ".join([pages_and_chunks[idx]["sentence_chunk"] for idx in top_results[1]])
        summary = generate_summary(prompt=query, context=top_chunks_text)
        print("\nGenerated Summary:\n", summary)

        # Save summary
        safe_prompt = "".join(c if c.isalnum() else "_" for c in query[:30])
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filepath = os.path.join(USER_NOTES_FOLDER, f"{timestamp}_{safe_prompt}.txt")
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(summary)
        print(f"[INFO] Summary saved to {filepath}\n")
