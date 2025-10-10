import os
import json
import time
from datetime import datetime
from llama_index.core import VectorStoreIndex, StorageContext, load_index_from_storage
from llama_index.llms.huggingface import HuggingFaceLLM
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.core.settings import Settings
from llama_index import GPTVectorStoreIndex
from llama_index.core import SimpleDirectoryReader
from state import read_prompt
from llama_index import Document

# --- Folder paths ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOADS_DIR = os.path.join(BASE_DIR, "User_Uploads")
INDEX_DIR = os.path.join(BASE_DIR, "rag_index_storage")
RESPONSES_DIR = os.path.join(BASE_DIR, "RAG_Responses")
os.makedirs(RESPONSES_DIR, exist_ok=True)

# --- Setup LLM and embeddings ---
llm = HuggingFaceLLM(
    model_name="TinyLlama/TinyLlama-1.1B-Chat-v1.0",
    tokenizer_name="TinyLlama/TinyLlama-1.1B-Chat-v1.0"
)
embed_model = HuggingFaceEmbedding(model_name="all-MiniLM-L6-v2")
Settings.llm = llm
Settings.embed_model = embed_model

# --- Helper functions ---
def clean_text(text: str) -> str:
    """Remove repeated lines."""
    lines = text.split("\n")
    unique_lines = []
    for line in lines:
        stripped = line.strip()
        if stripped and stripped not in unique_lines:
            unique_lines.append(stripped)
    return "\n".join(unique_lines)

def chunk_documents(documents, chunk_size=500, chunk_overlap=50):
    nodes = []
    for doc in documents:
        text = doc.get_text()
        start = 0
        while start < len(text):
            end = min(start + chunk_size, len(text))
            nodes.append(Document(text=text[start:end]))
            start += chunk_size - chunk_overlap
    return nodes

def load_or_build_index():
    """Load existing index or build a new one with chunking."""
    if os.path.exists(INDEX_DIR):
        storage_context = StorageContext.from_defaults(persist_dir=INDEX_DIR)
        return load_index_from_storage(storage_context)
    else:
        print("Building new index from uploaded files...")
        documents = SimpleDirectoryReader(UPLOADS_DIR).load_data()
        nodes = chunk_documents(documents, chunk_size=500, chunk_overlap=50) 
        index = VectorStoreIndex.from_documents(nodes)
        index.storage_context.persist(persist_dir=INDEX_DIR)
        print("Index built and saved!")
        return index

# --- Initialize index ---
index = load_or_build_index()
query_engine = index.as_query_engine()
indexed_files = set(os.listdir(UPLOADS_DIR))

print("RAG processor started. Monitoring uploads and prompts...")

# --- Main loop ---
while True:
    # Check for new uploaded files
    current_files = set(os.listdir(UPLOADS_DIR))
    new_files = current_files - indexed_files
    if new_files:
        print(f"New files detected: {new_files}. Updating index...")
        documents = SimpleDirectoryReader(UPLOADS_DIR, file_extractor=lambda path: os.path.basename(path) in new_files).load_data()
        nodes = chunk_documents(documents, chunk_size=500, chunk_overlap=50)
        index.insert_documents(nodes)
        index.storage_context.persist(persist_dir=INDEX_DIR)
        indexed_files.update(new_files)
        query_engine = index.as_query_engine()
        print("Index updated with new files.")

    # Check for new user prompt
    prompt = read_prompt()
    if prompt:
        print(f"New prompt detected: {prompt}")

        # Query each chunk individually for summarization
        all_chunk_summaries = []
        for node in index.storage_context.docstore.docs.values():
            chunk_text = node.get_text()
            wrapped_prompt = f"""
You are an expert study-notes generator.
Summarize the following chunk into clear, concise **paragraphs** suitable for studying.
Ignore headings or numbered lists. Focus only on meaningful explanations.

Chunk content:
{chunk_text}
"""
            response = query_engine.query(wrapped_prompt)
            all_chunk_summaries.append(str(response))

        # Merge and clean all chunk summaries
        final_summary = clean_text("\n".join(all_chunk_summaries))

        # Save final study notes
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        response_data = {
            "timestamp": timestamp,
            "query": prompt,
            "summary": final_summary
        }
        output_file = os.path.join(RESPONSES_DIR, f"response_{timestamp}.json")
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(response_data, f, indent=4, ensure_ascii=False)

        print(f"Summary saved to: {output_file}")

    # Sleep to avoid high CPU usage
    time.sleep(2)
