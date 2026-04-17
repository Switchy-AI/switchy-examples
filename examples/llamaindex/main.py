"""LlamaIndex + Switchy: inject persistent memory into a query engine."""

import os
from dotenv import load_dotenv
from llama_index.core import VectorStoreIndex, Document, Settings
from llama_index.llms.openai import OpenAI
from switchy_memory import SwitchyMemory

load_dotenv()

# Initialize Switchy
switchy = SwitchyMemory(namespace="llamaindex-demo")

# Configure LlamaIndex
Settings.llm = OpenAI(model="gpt-4o-mini", temperature=0.7)


def store_and_index():
    """Store some facts in Switchy and create a LlamaIndex index from them."""

    facts = [
        ("Our API rate limit is 1000 req/min for Pro tier.", "FACT"),
        ("The user prefers concise, technical responses.", "PREFERENCE"),
        ("Deploy using Docker on Cloud Run with min-instances=1.", "INSTRUCTION"),
    ]

    print("Storing memories in Switchy...")
    for content, mtype in facts:
        mem = switchy.write(content, mtype)
        print(f"  [{mtype}] {mem['id']}")

    # Pull memories back and create a LlamaIndex index
    print("\nBuilding LlamaIndex index from Switchy memories...")
    memories = switchy.query("all project context", limit=20)
    documents = [
        Document(text=m["content"], metadata={"type": m["type"], "id": m["id"]})
        for m in memories
    ]

    index = VectorStoreIndex.from_documents(documents)
    return index


def main():
    index = store_and_index()

    # Query the index
    engine = index.as_query_engine()

    questions = [
        "What's the API rate limit?",
        "How should I deploy the app?",
        "What style of responses does the user prefer?",
    ]

    for q in questions:
        print(f"\nQ: {q}")
        response = engine.query(q)
        print(f"A: {response}")


if __name__ == "__main__":
    main()
