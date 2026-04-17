import type { Entity, Relation } from './types.js';

type Requester = <T>(method: string, path: string, body?: unknown) => Promise<T>;

export class GraphClient {
  constructor(private request: Requester) {}

  /** Create an entity in the knowledge graph */
  async createEntity(namespace: string, opts: { name: string; type: string; properties?: Record<string, unknown> }): Promise<Entity> {
    return this.request('POST', `/api/v1/memory/${namespace}/graph/entities`, opts);
  }

  /** List entities in a namespace */
  async listEntities(namespace: string): Promise<Entity[]> {
    return this.request('GET', `/api/v1/memory/${namespace}/graph/entities`);
  }

  /** Create a relation between entities */
  async createRelation(namespace: string, opts: { source: string; target: string; type: string; properties?: Record<string, unknown> }): Promise<Relation> {
    return this.request('POST', `/api/v1/memory/${namespace}/graph/relations`, opts);
  }

  /** Get the full graph for a namespace */
  async getGraph(namespace: string): Promise<{ entities: Entity[]; relations: Relation[] }> {
    return this.request('GET', `/api/v1/memory/${namespace}/graph`);
  }
}
