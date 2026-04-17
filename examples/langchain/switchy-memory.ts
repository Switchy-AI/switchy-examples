import { BaseMemory, InputValues, OutputValues, MemoryVariables } from '@langchain/core/memory';
import { SwitchyClient } from '@switchy/sdk';

/**
 * LangChain-compatible memory backed by Switchy.
 * Drop this into any LangChain chain to get persistent, cross-model memory.
 */
export class SwitchyMemory extends BaseMemory {
  private client: SwitchyClient;
  private namespace: string;
  memoryKey = 'history';

  constructor(opts: { apiKey: string; namespace?: string; baseUrl?: string }) {
    super();
    this.client = new SwitchyClient({ apiKey: opts.apiKey, baseUrl: opts.baseUrl });
    this.namespace = opts.namespace ?? 'default';
  }

  get memoryKeys(): string[] {
    return [this.memoryKey];
  }

  async loadMemoryVariables(_values: InputValues): Promise<MemoryVariables> {
    const query = typeof _values === 'object' ? (_values.input as string ?? '') : '';
    if (!query) return { [this.memoryKey]: '' };

    const ctx = await this.client.memory.buildContext(this.namespace, {
      query,
      maxTokens: 2000,
    });
    return { [this.memoryKey]: ctx.context };
  }

  async saveContext(input: InputValues, output: OutputValues): Promise<void> {
    const userMsg = input.input as string ?? '';
    const aiMsg = output.output as string ?? output.response as string ?? '';

    if (userMsg) {
      await this.client.memory.write(this.namespace, {
        content: `User: ${userMsg}`,
        type: 'CONVERSATION',
      });
    }
    if (aiMsg) {
      await this.client.memory.write(this.namespace, {
        content: `Assistant: ${aiMsg}`,
        type: 'CONVERSATION',
      });
    }
  }
}
