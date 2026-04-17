# Quickstart — TypeScript

The simplest Switchy integration: write memories, query them, and build context for LLM prompts.

## Setup

```bash
cp .env.example .env
# Add your Switchy API key

npm install
npm start
```

## What it does

1. Writes a user preference and a fact to the `default` namespace
2. Queries memories with a natural language question
3. Builds a context window suitable for injecting into an LLM prompt
