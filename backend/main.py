from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
import json
import os

app = FastAPI()

# Serve static files (HTML, CSS, JS) from the frontend directory
app.mount("/", StaticFiles(directory="../frontend", html=True), name="frontend")

# Load the inverted index and document metadata
INDEX_FILE = "index.json"
inverted_index = {}
documents = {}

if os.path.exists(INDEX_FILE):
    with open(INDEX_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
        inverted_index = data.get("inverted_index", {})
        documents = data.get("documents", {})
    print("Index loaded successfully.")
else:
    print(f"Warning: {INDEX_FILE} not found. Please run indexer.py first.")

@app.get("/search")
async def search(q: str):
    query_words = q.lower().split()
    
    # Simple intersection of document IDs for now
    matching_doc_ids = set()
    if query_words:
        # Start with the set of documents for the first word
        first_word_docs = inverted_index.get(query_words[0], [])
        matching_doc_ids.update(first_word_docs)

        # Intersect with documents for subsequent words
        for i in range(1, len(query_words)):
            word = query_words[i]
            if word in inverted_index:
                matching_doc_ids.intersection_update(inverted_index[word])
            else:
                # If any word is not in the index, no documents will match
                matching_doc_ids.clear()
                break

    results = []
    for doc_id in matching_doc_ids:
        doc_info = documents.get(doc_id)
        if doc_info:
            # For now, we return the title and a simplified URL (filepath)
            # In a real scenario, you'd want the original URL from the crawler
            results.append({"title": doc_info["title"], "url": doc_info["filepath"]})
    
    return results

@app.get("/health")
async def health_check():
    return {"status": "ok", "index_loaded": bool(inverted_index)}

