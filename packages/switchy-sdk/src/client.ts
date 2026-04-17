import type { SwitchyConfig, ApiError } from './types.js';
import { MemoryClient } from './memory.js';
import { NamespaceClient } from './namespaces.js';
import { SessionClient } from './sessions.js';
import { GraphClient } from './graph.js';

export class SwitchyClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  readonly memory: MemoryClient;
  readonly namespaces: NamespaceClient;
  readonly sessions: SessionClient;
  readonly graph: GraphClient;

  constructor(config: SwitchyConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = (config.baseUrl ?? 'https://switchy.build').replace(/\/$/, '');

    this.memory = new MemoryClient(this.request.bind(this));
    this.namespaces = new NamespaceClient(this.request.bind(this));
    this.sessions = new SessionClient(this.request.bind(this));
    this.graph = new GraphClient(this.request.bind(this));
  }

  /** Internal fetch helper — sets auth headers, parses JSON, throws on errors */
  async request<T = unknown>(
    method: string,
    path: string,
    body?: unknown,
    query?: Record<string, string | number | undefined>,
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`);

    if (query) {
      for (const [k, v] of Object.entries(query)) {
        if (v !== undefined) url.searchParams.set(k, String(v));
      }
    }

    const res = await fetch(url.toString(), {
      method,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': '@switchy/sdk 0.1.0',
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    if (!res.ok) {
      const err: ApiError = await res.json().catch(() => ({
        error: 'unknown',
        message: res.statusText,
        statusCode: res.status,
      }));
      throw new Error(`Switchy API ${res.status}: ${err.message ?? err.error}`);
    }

    return res.json() as Promise<T>;
  }
}
