# Hybrid RAG — Semantic Memory + Knowledge Graph

Combines Switchy's semantic memory with its knowledge graph for richer, more structured retrieval-augmented generation.

## Setup

```bash
cp .env.example .env
# Add your Switchy + OpenAI API keys

npm install
npm start
```

## How it works

1. Seeds Switchy with semantic memories (facts, instructions, preferences)
2. Creates a knowledge graph (entities + relations) representing system architecture
3. For each query, retrieves from BOTH sources
4. Injects combined context into the LLM prompt

## Why hybrid?

- **Semantic memory** is great for fuzzy, natural language questions
- **Knowledge graph** captures structured relationships (A depends on B)
- Together, they give the LLM both broad context and precise facts
