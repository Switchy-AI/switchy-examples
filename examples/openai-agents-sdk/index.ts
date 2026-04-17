import 'dotenv/config';
import OpenAI from 'openai';
import { SwitchyClient } from '@switchy/sdk';

const switchy = new SwitchyClient({
  apiKey: process.env.SWITCHY_API_KEY!,
});

const openai = new OpenAI();
const ns = 'openai-agents-demo';

/** Memory-augmented agent that uses Switchy for persistent context */
async function runAgent(userMessage: string): Promise<string> {
  // 1. Retrieve relevant context from Switchy
  const ctx = await switchy.memory.buildContext(ns, {
    query: userMessage,
    maxTokens: 1500,
  });

  // 2. Define the agent with memory-aware system prompt
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: [
          'You are a helpful coding assistant with persistent memory.',
          'You remember everything the user has told you across sessions.',
          '',
          'Relevant memories:',
          ctx.context || '(no prior context)',
        ].join('\n'),
      },
      { role: 'user', content: userMessage },
    ],
    tools: [
      {
        type: 'function',
        function: {
          name: 'save_memory',
          description: 'Save an important fact or preference to long-term memory.',
          parameters: {
            type: 'object',
            properties: {
              content: { type: 'string', description: 'The memory to save' },
              type: {
                type: 'string',
                enum: ['FACT', 'PREFERENCE', 'INSTRUCTION', 'INSIGHT'],
                description: 'The type of memory',
              },
            },
            required: ['content', 'type'],
          },
        },
      },
    ],
  });

  const msg = response.choices[0].message;

  // 3. Handle tool calls (save_memory)
  if (msg.tool_calls) {
    for (const call of msg.tool_calls) {
      if (call.function.name === 'save_memory') {
        const args = JSON.parse(call.function.arguments);
        await switchy.memory.write(ns, {
          content: args.content,
          type: args.type,
        });
        console.log(`  [Memory saved: ${args.type}] ${args.content}`);
      }
    }
  }

  // 4. Save the conversation turn
  await Promise.all([
    switchy.memory.write(ns, { content: `User: ${userMessage}`, type: 'CONVERSATION' }),
    switchy.memory.write(ns, { content: `Assistant: ${msg.content}`, type: 'CONVERSATION' }),
  ]);

  return msg.content ?? '(no response)';
}

async function main() {
  const messages = [
    'I prefer Rust for systems programming and TypeScript for web apps.',
    'What language should I use for a new CLI tool?',
    'What were my language preferences again?',
  ];

  for (const msg of messages) {
    console.log(`\nYou: ${msg}`);
    const reply = await runAgent(msg);
    console.log(`AI: ${reply}`);
  }
}

main().catch(console.error);
