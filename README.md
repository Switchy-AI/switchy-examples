# switchy-examples

Copy-pasteable integration examples for [Switchy](https://switchy.build) — the shared memory layer for multi-model AI.

Each example is a minimal, runnable project. Clone the repo, set your `SWITCHY_API_KEY`, and it works.

---

## What's in here

```
switchy-examples/
├── quickstart/              # 30-line "hello memory" script
├── langchain/               # Switchy as a LangChain Memory class
├── llamaindex/              # Switchy as a LlamaIndex memory module
├── vercel-ai-sdk/           # Next.js chat app with persistent memory
├── crewai/                  # Multi-agent crew with shared memory
├── openai-agents-sdk/       # Agents SDK + Switchy working memory
├── openrouter-byok/         # BYOK setup — route 450+ models through Switchy
├── multi-model/             # Text → image → code, all sharing one memory
├── rag-hybrid/              # Switchy + your existing vector DB
└── python-quickstart/       # Same quickstart in Python
```

Each folder is self-contained with its own README, `package.json`/`requirements.txt`, and `.env.example`.

---

## Five-line quickstart

```ts
import { Switchy } from '@switchy/sdk';

const memory = new Switchy({ apiKey: process.env.SWITCHY_API_KEY }).memory;

await memory.write({ namespace: 'user_123', content: 'I prefer TypeScript over Python' });
const ctx = await memory.buildContext({ namespace: 'user_123', query: 'help me write a function', modelType: 'chat' });
// Pass `ctx.messages` to any model. That's it.
```

## Python

```python
from switchy import Switchy

memory = Switchy(api_key=os.environ["SWITCHY_API_KEY"]).memory

memory.write(namespace="user_123", content="I prefer TypeScript over Python")
ctx = memory.build_context(namespace="user_123", query="help me write a function", model_type="chat")
```

---

## Why examples, not a tutorial

Documentation that reads well and documentation that ships production code are different things. This repo is the second kind.

Every example here has been tested end-to-end. If something breaks, open an issue — we respond fast.

---

## Running locally

```bash
git clone https://github.com/Switchy-AI/switchy-examples
cd switchy-examples/quickstart
cp .env.example .env          # add your SWITCHY_API_KEY
npm install && npm start
```

Get a free API key at [switchy.build](https://switchy.build) — no card, no waitlist.

---

## Contributing

Got a stack we don't cover? Open a PR. The bar:

1. Minimal — smallest possible code that demonstrates the integration
2. Runnable — works out of the box with `.env.example` + `npm install` (or equivalent)
3. Honest — if Switchy doesn't help for your use case, say so in the README

---

## License

MIT. Do whatever you want.

---

## Related

- **[Switchy docs](https://switchy.build/docs)** — full SDK reference
- **[awesome-ai-memory](https://github.com/Switchy-AI/awesome-ai-memory)** — curated list of memory tools and papers
- **[memory-bench](https://github.com/Switchy-AI/memory-bench)** — open benchmark for agent memory systems
