import 'dotenv/config';
import OpenAI from 'openai';
import { SwitchyClient } from '@switchy/sdk';

const switchy = new SwitchyClient({ apiKey: process.env.SWITCHY_API_KEY! });
const openai = new OpenAI();
const ns = 'multi-model-demo';

/**
 * Demonstrates Switchy's core value: one memory across multiple models.
 *
 * - Step 1: Talk to GPT-4o-mini → memory is saved
 * - Step 2: Switch to GPT-4o → it remembers what GPT-4o-mini was told
 * - Step 3: Switch to GPT-3.5-turbo → it also has full context
 */

async function chatWithModel(model: string, message: string): Promise<string> {
  const ctx = await switchy.memory.buildContext(ns, {
    query: message,
    maxTokens: 2000,
  });

  const completion = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: 'system',
        content: [
          'You are a helpful assistant with persistent memory.',
          'You remember everything from previous conversations, even with different models.',
          '',
          'Your memories:',
          ctx.context || '(no prior memories)',
        ].join('\n'),
      },
      { role: 'user', content: message },
    ],
  });

  const reply = completion.choices[0].message.content ?? '';

  // Save to Switchy
  await Promise.all([
    switchy.memory.write(ns, {
      content: `User: ${message}`,
      type: 'CONVERSATION',
      metadata: { model },
    }),
    switchy.memory.write(ns, {
      content: `Assistant (${model}): ${reply}`,
      type: 'CONVERSATION',
      metadata: { model },
    }),
  ]);

  return reply;
}

async function main() {
  console.log('=== Multi-Model Memory Demo ===\n');

  // Conversation that hops between models
  const turns = [
    { model: 'gpt-4o-mini', message: "My name is Alex and I'm building a fintech startup called PayFlow." },
    { model: 'gpt-4o', message: "What's my startup called and what am I building?" },
    { model: 'gpt-4o-mini', message: 'We use Stripe for payments and PostgreSQL for our database.' },
    { model: 'gpt-3.5-turbo', message: 'Summarize everything you know about me and my project.' },
  ];

  for (const { model, message } of turns) {
    console.log(`\n[${model}]`);
    console.log(`You: ${message}`);
    const reply = await chatWithModel(model, message);
    console.log(`AI: ${reply}`);
  }

  console.log('\n\n--- Each model had full context from previous turns ---');
  console.log('--- This is the Switchy difference: one memory, every model ---');
}

main().catch(console.error);
