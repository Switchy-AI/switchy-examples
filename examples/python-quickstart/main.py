"""Switchy Python Quickstart — raw HTTP client (no SDK needed)."""

import os
import httpx
from dotenv import load_dotenv

load_dotenv()

BASE_URL = os.getenv("SWITCHY_BASE_URL", "https://switchy.build")
API_KEY = os.getenv("SWITCHY_API_KEY", "")

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
}

NAMESPACE = "default"


def write_memory(content: str, memory_type: str = "FACT") -> dict:
    """Write a semantic memory."""
    r = httpx.post(
        f"{BASE_URL}/api/v1/memory/{NAMESPACE}/semantic",
        headers=headers,
        json={"content": content, "type": memory_type},
    )
    r.raise_for_status()
    return r.json()


def query_memories(query: str, limit: int = 5) -> list[dict]:
    """Query memories by semantic similarity."""
    r = httpx.get(
        f"{BASE_URL}/api/v1/memory/{NAMESPACE}/semantic",
        headers=headers,
        params={"query": query, "limit": limit},
    )
    r.raise_for_status()
    return r.json()


def build_context(query: str, max_tokens: int = 1000) -> dict:
    """Build an LLM-ready context from relevant memories."""
    r = httpx.post(
        f"{BASE_URL}/api/v1/memory/{NAMESPACE}/context",
        headers=headers,
        json={"query": query, "maxTokens": max_tokens},
    )
    r.raise_for_status()
    return r.json()


def main():
    # 1. Write memories
    print("Writing memories...")
    mem1 = write_memory("User prefers Python and dark-themed IDEs.", "PREFERENCE")
    print(f"  Stored: {mem1['id']}")

    mem2 = write_memory("User is building a CLI tool for data pipelines.", "FACT")
    print(f"  Stored: {mem2['id']}")

    # 2. Query
    print("\nQuerying...")
    results = query_memories("What tools does the user build?")
    for r in results:
        print(f"  [{r['type']}] {r['content']} (score: {r.get('score', 'N/A')})")

    # 3. Build context
    print("\nBuilding context...")
    ctx = build_context("Help me document my CLI tool")
    print(f"  Tokens: {ctx['tokenCount']}")
    print(f"  Context:\n{ctx['context']}")


if __name__ == "__main__":
    main()
