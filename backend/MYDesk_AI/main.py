import os # To handle folder paths and files
import json # To read/write JSON files
import time # To pause the loop (sleep)
from datetime import datetime # To create timestamps for responses

# LlamaIndex libraries for RAG (retrieval + AI summaries)
from llama_index.core import VectorStoreIndex, StorageContext, load_index_from_storage  # For vector index storage
from llama_index.llms.huggingface import HuggingFaceLLM # To use HuggingFace AI models
from llama_index.embeddings.huggingface import HuggingFaceEmbedding   # To convert text to vectors
from llama_index.core.settings import Settings  # To set default AI and embedding models
from llama_index.core import SimpleDirectoryReader   # To read documents from folders
from state import read_prompt  #Custom function to read new user prompts from state file
from llama_index.core import Document # To create text chunks as document objects


# --- Folder paths ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__)) # Current folder path
UPLOADS_DIR = os.path.join(BASE_DIR, "User_Uploads")  # Folder where uploaded files are saved
INDEX_DIR = os.path.join(BASE_DIR, "rag_index_storage")  # Folder to save the vector index
RESPONSES_DIR = os.path.join(BASE_DIR, "RAG_Responses") # Folder to save AI summaries
os.makedirs(RESPONSES_DIR, exist_ok=True)  # Make sure the responses folder exists

# --- Setup LLM and embeddings ---
llm = HuggingFaceLLM(
    model_name="TinyLlama/TinyLlama-1.1B-Chat-v1.0", # Name of AI model
    tokenizer_name="TinyLlama/TinyLlama-1.1B-Chat-v1.0" # Tokenizer for AI model
)
embed_model = HuggingFaceEmbedding(model_name="all-MiniLM-L6-v2") # Model for embeddings


Settings.llm = llm # Set default AI model
Settings.embed_model = embed_model # Set default embedding model

# Helper functions to remove repeated lines
def clean_text(text: str) -> str:
    """Remove repeated lines."""
    lines = text.split("\n")
    unique_lines = []
    for line in lines:
        stripped = line.strip() # Remove spaces
        if stripped and stripped not in unique_lines:
            unique_lines.append(stripped)
    return "\n".join(unique_lines)

# Helper function to split large documents into smaller chunks
def chunk_documents(documents, chunk_size=500, chunk_overlap=50):

    """Split documents into smaller chunks for better processing."""
    """ Returns a list of Document objects"""

    nodes = []
    for doc in documents:
        text = doc.get_text()
        start = 0
        while start < len(text):
            end = min(start + chunk_size, len(text))
            nodes.append(Document(text=text[start:end])) # Create a chunk
            start += chunk_size - chunk_overlap
    return nodes

def load_or_build_index():
    """Load existing index or build a new one with chunking."""
    if os.path.exists(INDEX_DIR):
        storage_context = StorageContext.from_defaults(persist_dir=INDEX_DIR)
        return load_index_from_storage(storage_context)
    else:
        print("Building new index from uploaded files...")
        documents = SimpleDirectoryReader(UPLOADS_DIR).load_data() # Read all uploaded files
        nodes = chunk_documents(documents, chunk_size=500, chunk_overlap=50) # Split into chunks
        index = VectorStoreIndex.from_documents(nodes) # Create vector index
        index.storage_context.persist(persist_dir=INDEX_DIR) # Save index for later
        print("Index built and saved!") 
        return index

# --- Initialize index ---
index = load_or_build_index() # Load or build index
query_engine = index.as_query_engine() # Create engine to query AI
indexed_files = set(os.listdir(UPLOADS_DIR)) # Track already indexed files

print("RAG processor started. Monitoring uploads and prompts...")

# --- Main loop ---
while True:
    # Check for new uploaded files
    current_files = set(os.listdir(UPLOADS_DIR))
    new_files = current_files - indexed_files # Find files not yet indexed
    if new_files:
        print(f"New files detected: {new_files}. Updating index...")
        documents = SimpleDirectoryReader(UPLOADS_DIR, file_extractor=lambda path: os.path.basename(path) in new_files).load_data()
        nodes = chunk_documents(documents, chunk_size=500, chunk_overlap=50) # Read only new files
        index.insert_documents(nodes) # Add new chunks to index
        index.storage_context.persist(persist_dir=INDEX_DIR) # Save updated index
        indexed_files.update(new_files) # Update tracked files
        query_engine = index.as_query_engine()  # Update query engine
        print("Index updated with new files.")

    # Check for new user prompt
    prompt = read_prompt() # Read prompt from state file
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
            response = query_engine.query(wrapped_prompt)  # Ask AI to summarize
            all_chunk_summaries.append(str(response))

        # Merge and clean all chunk summaries
        final_summary = clean_text("\n".join(all_chunk_summaries))

        # Save final study notes
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S") # Create timestamp
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
