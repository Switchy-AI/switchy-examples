# LangChain + Switchy Memory

Drop-in persistent memory for LangChain chains. `SwitchyMemory` extends `BaseMemory` so it works with any chain.

## Setup

```bash
cp .env.example .env
# Add your Switchy + OpenAI API keys

npm install
npm start
```

## How it works

- `loadMemoryVariables()` calls `client.memory.buildContext()` to retrieve relevant memories
- `saveContext()` writes each user/AI message to Switchy as `CONVERSATION` memories
- Memories persist across sessions, models, and frameworks
