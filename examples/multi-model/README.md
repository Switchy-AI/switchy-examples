# Multi-Model Memory

The core Switchy demo: have a conversation that switches between GPT-4o-mini, GPT-4o, and GPT-3.5-turbo. Every model remembers what the others were told.

## Setup

```bash
cp .env.example .env
# Add your Switchy + OpenAI API keys

npm install
npm start
```

## What it demonstrates

1. Tell GPT-4o-mini your name and project
2. Ask GPT-4o what it knows — it remembers (via Switchy)
3. Tell GPT-4o-mini more details
4. Ask GPT-3.5-turbo to summarize — it has the full picture

This is impossible without Switchy. Each model has its own context window, but Switchy gives them shared persistent memory.
