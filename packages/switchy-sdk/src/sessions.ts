import type { Session } from './types.js';

type Requester = <T>(method: string, path: string, body?: unknown) => Promise<T>;

export class SessionClient {
  constructor(private request: Requester) {}

  /** Create a new session in a namespace */
  async create(namespace: string, opts?: { model?: string }): Promise<Session> {
    return this.request('POST', `/api/v1/namespaces/${namespace}/sessions`, opts);
  }

  /** List sessions in a namespace */
  async list(namespace: string): Promise<Session[]> {
    return this.request('GET', `/api/v1/namespaces/${namespace}/sessions`);
  }
}
