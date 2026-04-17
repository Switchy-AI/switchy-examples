import 'dotenv/config';
import { SwitchyClient } from '@switchy/sdk';

const switchy = new SwitchyClient({
  apiKey: process.env.SWITCHY_API_KEY!,
});

const ns = 'openrouter-demo';
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY!;

/** Call any model via OpenRouter with Switchy memory context */
async function chatWithModel(
  model: string,
  userMessage: string,
): Promise<string> {
  // 1. Build context from Switchy
  const ctx = await switchy.memory.buildContext(ns, {
    query: userMessage,
    maxTokens: 1500,
  });

  // 2. Call OpenRouter (OpenAI-compatible API)
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENROUTER_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://switchy.build',
      'X-Title': 'Switchy Example',
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant. Relevant context:\n\n${ctx.context || '(none)'}`,
        },
        { role: 'user', content: userMessage },
      ],
    }),
  });

  const data = await res.json();
  const reply = data.choices?.[0]?.message?.content ?? '(no response)';

  // 3. Save to Switchy
  await Promise.all([
    switchy.memory.write(ns, { content: `User: ${userMessage}`, type: 'CONVERSATION' }),
    switchy.memory.write(ns, { content: `Assistant (${model}): ${reply}`, type: 'CONVERSATION' }),
  ]);

  return reply;
}

async function main() {
  // Use different models — memory persists across all of them
  const conversations = [
    { model: 'anthropic/claude-3.5-sonnet', message: "I'm building an e-commerce API in Go." },
    { model: 'openai/gpt-4o-mini', message: 'What architecture pattern should I use?' },
    { model: 'google/gemini-2.0-flash', message: 'What language was I using for my project?' },
    { model: 'meta-llama/llama-3.1-70b-instruct', message: 'Summarize what you know about me.' },
  ];

  for (const { model, message } of conversations) {
    console.log(`\n[${model}]`);
    console.log(`You: ${message}`);
    const reply = await chatWithModel(model, message);
    console.log(`AI: ${reply}`);
  }

  console.log('\n--- Same memory, four different models ---');
}

main().catch(console.error);
