import axios, { AxiosInstance } from "axios";

export interface MemoryUpsert {
  title: string;
  content: string;
  tags?: string[];
  ownerId?: string;
  memoryId?: string;
}

export interface MemoryRecord {
  id: string;
  title: string;
  content: string;
  tags: string[];
  ownerId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MemorySearch {
  ownerId?: string;
  query: string;
  topK?: number;
  filterTags?: string[];
  cursor?: string | null;
}

interface RawMemoryRecord {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  ownerId?: string;
  owner_id?: string;
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;
  updated_at?: string;
}

const mapRecord = (record: RawMemoryRecord): MemoryRecord => {
  return {
    id: record.id,
    title: record.title,
    content: record.content,
    tags: record.tags ?? [],
    ownerId: record.owner_id ?? record.ownerId ?? "",
    createdAt: record.created_at ?? record.createdAt,
    updatedAt: record.updated_at ?? record.updatedAt,
  };
};

const DEFAULT_BASE_URL = "https://worker.memorynode.ai";

export class MemoryNodeClient {
  private client: AxiosInstance;
  private defaultOwnerId?: string;

  constructor(
    baseURL: string = DEFAULT_BASE_URL,
    apiKeyOrOptions?: string | { apiKey?: string; ownerId?: string },
  ) {
    let apiKey: string | undefined;
    if (typeof apiKeyOrOptions === "string") {
      apiKey = apiKeyOrOptions;
    } else if (typeof apiKeyOrOptions === "object" && apiKeyOrOptions !== null) {
      apiKey = apiKeyOrOptions.apiKey;
      this.defaultOwnerId = apiKeyOrOptions.ownerId;
    }

    this.client = axios.create({
      baseURL: baseURL.replace(/\/+$/, "") || DEFAULT_BASE_URL,
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
    });
  }

  private resolveOwnerId(ownerId?: string): string {
    const resolved = ownerId ?? this.defaultOwnerId;
    if (!resolved) {
      throw new Error("ownerId is required for this operation");
    }
    return resolved;
  }

  private ownerHeaders(ownerId: string): Record<string, string> {
    return { "x-memorynode-owner": ownerId };
  }

  async upsertMemory(payload: MemoryUpsert): Promise<MemoryRecord> {
    if (payload.memoryId) {
      throw new Error("Phase-1 edge API does not support in-place memory updates.");
    }
    const ownerId = this.resolveOwnerId(payload.ownerId);
    const body = {
      ownerId,
      title: payload.title,
      content: payload.content,
      tags: payload.tags ?? [],
    };
    const response = await this.client.post("/ingest", body, {
      headers: this.ownerHeaders(ownerId),
    });
    return mapRecord(response.data as RawMemoryRecord);
  }

  async searchMemories(query: MemorySearch): Promise<{ items: MemoryRecord[]; cursor: string | null }> {
    const ownerId = this.resolveOwnerId(query.ownerId);
    const response = await this.client.post(
      "/search",
      {
        ownerId,
        query: query.query,
        topK: query.topK ?? 5,
        filterTags: query.filterTags ?? [],
        cursor: query.cursor ?? null,
      },
      {
        headers: this.ownerHeaders(ownerId),
      },
    );
    const payload = response.data as { items?: RawMemoryRecord[]; cursor?: string | null };
    return {
      items: (payload.items ?? []).map(mapRecord),
      cursor: payload.cursor ?? null,
    };
  }
}
