import os
import json
from bs4 import BeautifulSoup
import re

def build_inverted_index(corpus_dir="corpus", output_file="index.json"):
    inverted_index = {}
    documents = {}
    doc_id_counter = 0

    for filename in os.listdir(corpus_dir):
        if filename.endswith(".html"):
            filepath = os.path.join(corpus_dir, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                html_content = f.read()

            soup = BeautifulSoup(html_content, 'html.parser')
            
            # Extract title for display in search results
            title = soup.title.string if soup.title else os.path.basename(filename)
            
            # Remove script and style elements
            for script_or_style in soup(["script", "style"]):
                script_or_style.extract()

            text = soup.get_text()
            words = re.findall(r'\b\w+\b', text.lower()) # Simple tokenization

            doc_id = str(doc_id_counter)
            documents[doc_id] = {"title": title, "filepath": filepath}
            doc_id_counter += 1

            for word in words:
                if word not in inverted_index:
                    inverted_index[word] = []
                if doc_id not in inverted_index[word]: # Store unique document IDs
                    inverted_index[word].append(doc_id)

    # Save the inverted index and document metadata
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump({"inverted_index": inverted_index, "documents": documents}, f, indent=4)
    print(f"Inverted index built and saved to {output_file}")

if __name__ == "__main__":
    build_inverted_index()
