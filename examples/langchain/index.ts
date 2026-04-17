import 'dotenv/config';
import { ChatOpenAI } from '@langchain/openai';
import { ConversationChain } from 'langchain/chains';
import { SwitchyMemory } from './switchy-memory.js';

const memory = new SwitchyMemory({
  apiKey: process.env.SWITCHY_API_KEY!,
  namespace: 'langchain-demo',
});

const llm = new ChatOpenAI({
  modelName: 'gpt-4o-mini',
  temperature: 0.7,
});

const chain = new ConversationChain({ llm, memory });

async function main() {
  const questions = [
    "Hi, I'm building a React dashboard for IoT sensors.",
    'What charting library would you recommend for real-time data?',
    'Can you remind me what I said I was building?',
  ];

  for (const q of questions) {
    console.log(`\nYou: ${q}`);
    const res = await chain.invoke({ input: q });
    console.log(`AI: ${res.response}`);
  }

  console.log('\n--- Memory persists across sessions and models ---');
  console.log('Try running this again — the AI will remember the conversation.');
}

main().catch(console.error);
