# Vercel AI SDK + Switchy Memory

Use Switchy for persistent memory with the Vercel AI SDK's `generateText()`.

## Setup

```bash
cp .env.example .env
# Add your Switchy + OpenAI API keys

npm install
npm start
```

## How it works

1. Before each LLM call, builds a context window from Switchy memories
2. Injects context into the system prompt
3. Saves both user and AI messages back to Switchy
4. Memory persists across sessions — the AI remembers past conversations
