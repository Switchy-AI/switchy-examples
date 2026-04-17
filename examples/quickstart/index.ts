import 'dotenv/config';
import { SwitchyClient } from '@switchy/sdk';

const client = new SwitchyClient({
  apiKey: process.env.SWITCHY_API_KEY!,
});

async function main() {
  const ns = 'default';

  // 1. Write a memory
  console.log('Writing memory...');
  const mem = await client.memory.write(ns, {
    content: 'The user prefers dark mode and uses TypeScript exclusively.',
    type: 'PREFERENCE',
  });
  console.log('Stored:', mem.id);

  // 2. Write another memory
  await client.memory.write(ns, {
    content: 'The user is building a SaaS product for developer tools.',
    type: 'FACT',
  });

  // 3. Query memories
  console.log('\nQuerying memories...');
  const results = await client.memory.query(ns, {
    query: 'What does the user build?',
    limit: 5,
  });
  console.log(`Found ${results.length} memories:`);
  for (const r of results) {
    console.log(`  [${r.type}] ${r.content} (score: ${r.score?.toFixed(3)})`);
  }

  // 4. Build context for an LLM prompt
  console.log('\nBuilding context...');
  const ctx = await client.memory.buildContext(ns, {
    query: 'Help me write a README for my project',
    maxTokens: 1000,
  });
  console.log(`Context (${ctx.tokenCount} tokens):\n${ctx.context}`);
}

main().catch(console.error);
