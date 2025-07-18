import requests
from bs4 import BeautifulSoup
import os

def crawl_and_save(urls, output_dir="corpus"):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    for i, url in enumerate(urls):
        try:
            response = requests.get(url)
            response.raise_for_status()  # Raise an exception for HTTP errors

            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Remove script and style elements to clean up content
            for script_or_style in soup(["script", "style"]):
                script_or_style.extract()

            # Get text
            text = soup.get_text()

            # Break into lines and remove leading/trailing space on each
            lines = (line.strip() for line in text.splitlines())
            # Break multi-hyphenated words into a set of words
            chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
            # Drop blank lines
            text = '\n'.join(chunk for chunk in chunks if chunk)

            filename = os.path.join(output_dir, f"page_{i}.html")
            with open(filename, "w", encoding="utf-8") as f:
                f.write(response.text)
            print(f"Saved {url} to {filename}")

        except requests.exceptions.RequestException as e:
            print(f"Error crawling {url}: {e}")
        except Exception as e:
            print(f"An unexpected error occurred for {url}: {e}")

if __name__ == "__main__":
    # Example URLs to crawl
    # For a real crawler, you'd want to discover links and follow them
    # For this prototype, we'll use a few fixed URLs.
    # IMPORTANT: Choose URLs that are publicly accessible and allow crawling.
    # Avoid very large sites or sites that might block automated requests.
    urls_to_crawl = [
        "https://www.python.org/",
        "https://www.djangoproject.com/",
        "https://fastapi.tiangolo.com/",
        "https://fr.wikipedia.org/wiki/Intelligence_artificielle",
        "https://fr.wikipedia.org/wiki/Apprentissage_automatique"
    ]
    crawl_and_save(urls_to_crawl)
