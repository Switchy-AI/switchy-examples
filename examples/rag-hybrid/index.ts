import 'dotenv/config';
import OpenAI from 'openai';
import { SwitchyClient } from '@switchy/sdk';

const switchy = new SwitchyClient({ apiKey: process.env.SWITCHY_API_KEY! });
const openai = new OpenAI();
const ns = 'rag-hybrid-demo';

/**
 * Hybrid RAG: combines Switchy semantic memory with knowledge graph
 * for richer, more structured context retrieval.
 */

async function seedKnowledgeBase() {
  console.log('Seeding knowledge base...\n');

  // Semantic memories
  const memories = [
    { content: 'Our API supports REST and GraphQL endpoints.', type: 'FACT' as const },
    { content: 'Rate limits: Free=100/min, Pro=1000/min, Enterprise=10000/min.', type: 'FACT' as const },
    { content: 'Authentication uses Bearer tokens with JWT.', type: 'FACT' as const },
    { content: 'The database is PostgreSQL 16 with pgvector extension.', type: 'FACT' as const },
    { content: 'Deploy with Docker on Cloud Run, min-instances=1.', type: 'INSTRUCTION' as const },
    { content: 'Always use connection pooling via PgBouncer in production.', type: 'INSTRUCTION' as const },
    { content: 'User prefers TypeScript and functional programming.', type: 'PREFERENCE' as const },
  ];

  for (const m of memories) {
    await switchy.memory.write(ns, m);
    console.log(`  [${m.type}] ${m.content}`);
  }

  // Knowledge graph entities
  const entities = [
    { name: 'API Gateway', type: 'service' },
    { name: 'Auth Service', type: 'service' },
    { name: 'PostgreSQL', type: 'database' },
    { name: 'Redis', type: 'cache' },
    { name: 'Cloud Run', type: 'infrastructure' },
  ];

  console.log('\n  Creating graph entities...');
  const created: Record<string, string> = {};
  for (const e of entities) {
    const ent = await switchy.graph.createEntity(ns, e);
    created[e.name] = ent.id;
    console.log(`  [Entity] ${e.name} (${e.type})`);
  }

  // Relations
  const relations = [
    { source: created['API Gateway'], target: created['Auth Service'], type: 'authenticates_via' },
    { source: created['API Gateway'], target: created['PostgreSQL'], type: 'queries' },
    { source: created['API Gateway'], target: created['Redis'], type: 'caches_with' },
    { source: created['Cloud Run'], target: created['API Gateway'], type: 'hosts' },
  ];

  console.log('  Creating graph relations...');
  for (const r of relations) {
    await switchy.graph.createRelation(ns, r);
  }
}

async function hybridQuery(question: string): Promise<string> {
  // 1. Semantic memory search
  const ctx = await switchy.memory.buildContext(ns, {
    query: question,
    maxTokens: 1500,
  });

  // 2. Knowledge graph
  const graph = await switchy.graph.getGraph(ns);
  const graphContext = [
    'System Architecture:',
    ...graph.entities.map((e) => `- ${e.name} (${e.type})`),
    '',
    'Relationships:',
    ...graph.relations.map((r) => {
      const src = graph.entities.find((e) => e.id === r.source)?.name ?? r.source;
      const tgt = graph.entities.find((e) => e.id === r.target)?.name ?? r.target;
      return `- ${src} --[${r.type}]--> ${tgt}`;
    }),
  ].join('\n');

  // 3. Combine both into system prompt
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: [
          'You are a technical assistant with access to two knowledge sources:',
          '',
          '## Semantic Memory',
          ctx.context || '(empty)',
          '',
          '## Knowledge Graph',
          graphContext,
          '',
          'Use both sources to give precise, well-grounded answers.',
        ].join('\n'),
      },
      { role: 'user', content: question },
    ],
  });

  return completion.choices[0].message.content ?? '';
}

async function main() {
  await seedKnowledgeBase();

  console.log('\n=== Hybrid RAG Queries ===');

  const questions = [
    'What database do we use and what are the rate limits?',
    'How does the API Gateway authenticate requests?',
    'Give me the deployment instructions for our system.',
    'Draw me a picture of our architecture based on what you know.',
  ];

  for (const q of questions) {
    console.log(`\nQ: ${q}`);
    const answer = await hybridQuery(q);
    console.log(`A: ${answer}`);
  }
}

main().catch(console.error);
