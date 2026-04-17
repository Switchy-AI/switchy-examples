import type { Namespace } from './types.js';

type Requester = <T>(method: string, path: string, body?: unknown) => Promise<T>;

export class NamespaceClient {
  constructor(private request: Requester) {}

  /** Create a new namespace */
  async create(opts: { name: string; slug?: string }): Promise<Namespace> {
    return this.request('POST', '/api/v1/namespaces', opts);
  }

  /** List all namespaces */
  async list(): Promise<Namespace[]> {
    return this.request('GET', '/api/v1/namespaces');
  }

  /** Get a namespace by slug */
  async get(slug: string): Promise<Namespace> {
    return this.request('GET', `/api/v1/namespaces/${slug}`);
  }

  /** Delete a namespace */
  async delete(slug: string): Promise<void> {
    return this.request('DELETE', `/api/v1/namespaces/${slug}`);
  }
}
