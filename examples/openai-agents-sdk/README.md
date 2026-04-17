# OpenAI Agents SDK + Switchy Memory

An OpenAI function-calling agent with persistent memory powered by Switchy. The agent can save and recall information across sessions.

## Setup

```bash
cp .env.example .env
# Add your Switchy + OpenAI API keys

npm install
npm start
```

## How it works

1. Before each turn, retrieves relevant memories from Switchy
2. Injects them into the system prompt
3. Exposes a `save_memory` tool the agent can call to store important facts
4. Automatically saves each conversation turn to Switchy
