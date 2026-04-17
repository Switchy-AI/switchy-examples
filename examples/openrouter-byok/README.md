# OpenRouter BYOK + Switchy Memory

Bring Your Own Key (BYOK) with OpenRouter — access 200+ models while Switchy keeps memory consistent across all of them.

## Setup

```bash
cp .env.example .env
# Add your Switchy + OpenRouter API keys

npm install
npm start
```

## How it works

1. Each message uses a different model via OpenRouter (Claude, GPT-4o, Gemini, Llama)
2. Before each call, Switchy provides relevant context from memory
3. After each call, the conversation is saved to Switchy
4. Every model shares the same memory — true cross-model persistence
