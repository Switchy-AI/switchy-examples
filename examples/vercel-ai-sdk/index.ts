import 'dotenv/config';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { SwitchyClient } from '@switchy/sdk';

const client = new SwitchyClient({
  apiKey: process.env.SWITCHY_API_KEY!,
});

const ns = 'vercel-ai-demo';

async function chat(userMessage: string): Promise<string> {
  // 1. Build context from Switchy memory
  const ctx = await client.memory.buildContext(ns, {
    query: userMessage,
    maxTokens: 1500,
  });

  // 2. Generate response with Vercel AI SDK
  const { text } = await generateText({
    model: openai('gpt-4o-mini'),
    system: `You are a helpful assistant. Here is relevant context from previous conversations:\n\n${ctx.context}`,
    prompt: userMessage,
  });

  // 3. Save both messages to Switchy
  await Promise.all([
    client.memory.write(ns, { content: `User: ${userMessage}`, type: 'CONVERSATION' }),
    client.memory.write(ns, { content: `Assistant: ${text}`, type: 'CONVERSATION' }),
  ]);

  return text;
}

async function main() {
  const messages = [
    "I'm working on a Next.js app with server components.",
    'What data fetching pattern should I use?',
    'What framework was I using again?',
  ];

  for (const msg of messages) {
    console.log(`\nYou: ${msg}`);
    const reply = await chat(msg);
    console.log(`AI: ${reply}`);
  }
}

main().catch(console.error);
