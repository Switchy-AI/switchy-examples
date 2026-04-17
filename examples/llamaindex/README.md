# LlamaIndex + Switchy Memory

Use Switchy as a persistent memory layer alongside LlamaIndex's query engine.

## Setup

```bash
cp .env.example .env
# Add your Switchy + OpenAI API keys

pip install -r requirements.txt
python main.py
```

## How it works

1. Stores facts, preferences, and instructions in Switchy
2. Pulls memories back and indexes them with LlamaIndex
3. Queries the index — answers are grounded in your persistent memory
