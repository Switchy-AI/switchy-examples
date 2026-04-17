# CrewAI + Switchy Shared Memory

Give your CrewAI agents persistent shared memory via Switchy. Agents can save findings and read each other's work across sessions.

## Setup

```bash
cp .env.example .env
# Add your Switchy + OpenAI API keys

pip install -r requirements.txt
python main.py
```

## How it works

1. A `SwitchyMemory` instance is shared across all agents
2. The researcher stores findings in Switchy
3. The writer pulls research from Switchy to create content
4. All memories persist — rerun the crew and it builds on past work
