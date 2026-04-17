"""Switchy memory client for CrewAI agents."""

import os
import httpx


class SwitchyMemory:
    """Thin Switchy API client for Python integrations."""

    def __init__(
        self,
        api_key: str | None = None,
        base_url: str = "https://switchy.build",
        namespace: str = "default",
    ):
        self.api_key = api_key or os.getenv("SWITCHY_API_KEY", "")
        self.base_url = base_url.rstrip("/")
        self.namespace = namespace
        self._client = httpx.Client(
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            },
            timeout=30,
        )

    def write(self, content: str, memory_type: str = "FACT", **kwargs) -> dict:
        r = self._client.post(
            f"{self.base_url}/api/v1/memory/{self.namespace}/semantic",
            json={"content": content, "type": memory_type, **kwargs},
        )
        r.raise_for_status()
        return r.json()

    def query(self, query: str, limit: int = 5) -> list[dict]:
        r = self._client.get(
            f"{self.base_url}/api/v1/memory/{self.namespace}/semantic",
            params={"query": query, "limit": limit},
        )
        r.raise_for_status()
        return r.json()

    def build_context(self, query: str, max_tokens: int = 2000) -> dict:
        r = self._client.post(
            f"{self.base_url}/api/v1/memory/{self.namespace}/context",
            json={"query": query, "maxTokens": max_tokens},
        )
        r.raise_for_status()
        return r.json()
