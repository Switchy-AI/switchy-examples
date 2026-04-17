# switchy-examples

Copy-pasteable integration examples for [Switchy](https://switchy.build) — the shared memory layer for multi-model AI.

Each example is a minimal, runnable project. Clone the repo, set your `SWITCHY_API_KEY`, and it works.

---

## What's in here

```
switchy-examples/
├── packages/
│   └── switchy-sdk/           # Lightweight TypeScript SDK
├── examples/
│   ├── quickstart/            # 30-line "hello memory" script (TS)
│   ├── python-quickstart/     # Same quickstart in Python (no SDK needed)
│   ├── langchain/             # Switchy as a LangChain Memory class
│   ├── llamaindex/            # Switchy + LlamaIndex query engine
│   ├── vercel-ai-sdk/         # Vercel AI SDK with persistent memory
│   ├── crewai/                # Multi-agent crew with shared memory
│   ├── openai-agents-sdk/     # Function-calling agent with save_memory tool
│   ├── openrouter-byok/       # BYOK — 4 different models, one memory
│   ├── multi-model/           # GPT-4o ↔ GPT-4o-mini ↔ GPT-3.5 sharing memory
│   └── rag-hybrid/            # Semantic memory + knowledge graph RAG
└── package.json               # npm workspaces root
```

Each folder is self-contained with its own README, `package.json` / `requirements.txt`, and `.env.example`.

---

## Quick start

```bash
git clone https://github.com/Switchy-AI/switchy-examples
cd switchy-examples
npm install                       # installs all workspaces

cd examples/quickstart
cp .env.example .env              # add your SWITCHY_API_KEY
npm start
```

Get a free API key at [switchy.build](https://switchy.build).

---

## SDK usage

The `@switchy/sdk` package is a thin HTTP client (like Stripe's SDK). It works with any TypeScript/Node.js project:

```ts
import { SwitchyClient } from '@switchy/sdk';

const client = new SwitchyClient({ apiKey: process.env.SWITCHY_API_KEY! });

// Write a memory
await client.memory.write('default', {
  content: 'User prefers TypeScript and dark mode.',
  type: 'PREFERENCE',
});

// Build context for any LLM prompt
const ctx = await client.memory.buildContext('default', {
  query: 'Help me set up my editor',
  maxTokens: 2000,
});

// Pass ctx.context into your system prompt — that's it.
```

### Python (no SDK needed)

```python
import httpx

headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
r = httpx.post(f"{base_url}/api/v1/memory/default/semantic",
               headers=headers, json={"content": "...", "type": "FACT"})
```

---

## Examples by framework

| Example | Language | Framework | What it shows |
|---------|----------|-----------|---------------|
| [quickstart](examples/quickstart/) | TypeScript | — | Write, query, build context |
| [python-quickstart](examples/python-quickstart/) | Python | httpx | Same as above, pure Python |
| [langchain](examples/langchain/) | TypeScript | LangChain | `SwitchyMemory` extends `BaseMemory` |
| [llamaindex](examples/llamaindex/) | Python | LlamaIndex | Memory → Documents → Query Engine |
| [vercel-ai-sdk](examples/vercel-ai-sdk/) | TypeScript | Vercel AI SDK | `generateText()` with memory context |
| [crewai](examples/crewai/) | Python | CrewAI | Shared memory across agent crew |
| [openai-agents-sdk](examples/openai-agents-sdk/) | TypeScript | OpenAI | Function-calling agent with `save_memory` tool |
| [openrouter-byok](examples/openrouter-byok/) | TypeScript | OpenRouter | 4 models, one memory, BYOK |
| [multi-model](examples/multi-model/) | TypeScript | OpenAI | GPT-4o ↔ mini ↔ 3.5 sharing memory |
| [rag-hybrid](examples/rag-hybrid/) | TypeScript | OpenAI | Semantic memory + knowledge graph |

---

## Contributing

Got a stack we don't cover? Open a PR. The bar:

1. **Minimal** — smallest possible code that demonstrates the integration
2. **Runnable** — works out of the box with `.env.example` + `npm install` (or equivalent)
3. **Honest** — if Switchy doesn't help for your use case, say so in the README

---

## License

MIT

---

## Links

- [Switchy](https://switchy.build) — the product
- [API Docs](https://switchy.build/docs) — full reference
- [X](https://x.com/switchy_ai) · [GitHub](https://github.com/Switchy-AI) · [LinkedIn](https://www.linkedin.com/company/switchy-ai)
