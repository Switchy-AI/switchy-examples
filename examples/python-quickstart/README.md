# Quickstart — Python

Pure Python example using `httpx` — no SDK dependency, just raw HTTP calls.

## Setup

```bash
cp .env.example .env
# Add your Switchy API key

pip install -r requirements.txt
python main.py
```

## What it does

1. Writes a preference and a fact to the `default` namespace
2. Queries memories with natural language
3. Builds an LLM-ready context window
