import type {
  SemanticMemory,
  MemoryWriteRequest,
  MemoryQueryParams,
  ContextRequest,
  ContextResponse,
  Frame,
} from './types.js';

type Requester = <T>(method: string, path: string, body?: unknown, query?: Record<string, string | number | undefined>) => Promise<T>;

export class MemoryClient {
  constructor(private request: Requester) {}

  /** Write a semantic memory to a namespace */
  async write(namespace: string, opts: MemoryWriteRequest): Promise<SemanticMemory> {
    return this.request('POST', `/api/v1/memory/${namespace}/semantic`, opts);
  }

  /** Query semantic memories */
  async query(namespace: string, params?: MemoryQueryParams): Promise<SemanticMemory[]> {
    return this.request('GET', `/api/v1/memory/${namespace}/semantic`, undefined, params as Record<string, string | number | undefined>);
  }

  /** Build a context window from relevant memories */
  async buildContext(namespace: string, opts: ContextRequest): Promise<ContextResponse> {
    return this.request('POST', `/api/v1/memory/${namespace}/context`, opts);
  }

  /** Full-text search across memories */
  async search(namespace: string, params: { query: string; limit?: number }): Promise<SemanticMemory[]> {
    return this.request('GET', `/api/v1/memory/${namespace}/search`, undefined, params);
  }

  /** Create a new memory frame */
  async createFrame(namespace: string, opts?: { metadata?: Record<string, unknown> }): Promise<Frame> {
    return this.request('POST', `/api/v1/memory/${namespace}/frames`, opts);
  }

  /** List all frames in a namespace */
  async listFrames(namespace: string): Promise<Frame[]> {
    return this.request('GET', `/api/v1/memory/${namespace}/frames`);
  }

  /** Close an active frame (triggers summarization) */
  async closeFrame(namespace: string, frameId: string): Promise<Frame> {
    return this.request('POST', `/api/v1/memory/${namespace}/frames/${frameId}/close`);
  }
}
