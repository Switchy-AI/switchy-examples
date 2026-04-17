/** Memory types supported by Switchy */
export type MemoryType =
  | 'FACT'
  | 'CONTEXT'
  | 'INSTRUCTION'
  | 'PREFERENCE'
  | 'CONVERSATION'
  | 'SUMMARY'
  | 'INSIGHT';

/** A single semantic memory entry */
export interface SemanticMemory {
  id: string;
  content: string;
  type: MemoryType;
  metadata?: Record<string, unknown>;
  score?: number;
  createdAt: string;
  updatedAt: string;
}

/** Request to write a semantic memory */
export interface MemoryWriteRequest {
  content: string;
  type?: MemoryType;
  metadata?: Record<string, unknown>;
  sessionId?: string;
}

/** Query parameters for memory search */
export interface MemoryQueryParams {
  query?: string;
  type?: MemoryType;
  limit?: number;
  threshold?: number;
}

/** Context builder request */
export interface ContextRequest {
  query: string;
  maxTokens?: number;
  types?: MemoryType[];
  sessionId?: string;
}

/** Context builder response */
export interface ContextResponse {
  context: string;
  memories: SemanticMemory[];
  tokenCount: number;
}

/** A memory frame (conversation window) */
export interface Frame {
  id: string;
  namespace: string;
  status: 'OPEN' | 'CLOSED';
  summary?: string;
  memoryCount: number;
  createdAt: string;
  closedAt?: string;
}

/** Knowledge graph entity */
export interface Entity {
  id: string;
  name: string;
  type: string;
  properties?: Record<string, unknown>;
}

/** Knowledge graph relation */
export interface Relation {
  id: string;
  source: string;
  target: string;
  type: string;
  properties?: Record<string, unknown>;
}

/** Namespace */
export interface Namespace {
  id: string;
  name: string;
  slug: string;
  memoryCount: number;
  createdAt: string;
}

/** Session */
export interface Session {
  id: string;
  namespace: string;
  model?: string;
  createdAt: string;
}

/** Standard API error */
export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

/** SDK configuration */
export interface SwitchyConfig {
  apiKey: string;
  baseUrl?: string;
}
