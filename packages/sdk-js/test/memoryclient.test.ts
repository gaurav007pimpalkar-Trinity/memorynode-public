import { describe, expect, it } from "vitest";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { MemoryNodeClient } from "../src/index";

const installMockAdapter = (
  client: MemoryNodeClient,
  handler: (config: InternalAxiosRequestConfig) => Promise<AxiosResponse>,
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const axiosInstance = (client as any).client;
  axiosInstance.defaults.adapter = handler;
};

describe("MemoryNodeClient", () => {
  it("requires ownerId", async () => {
    const client = new MemoryNodeClient("https://worker.memorynode.ai", { apiKey: "key" });
    await expect(
      client.upsertMemory({
        title: "hello",
        content: "world",
      }),
    ).rejects.toThrow(/ownerId is required/);
  });

  it("upserts and maps a memory", async () => {
    const client = new MemoryNodeClient("https://worker.memorynode.ai", { apiKey: "key", ownerId: "owner-1" });

    installMockAdapter(client, async (config) => {
      if (config.url?.includes("/ingest")) {
        return {
          data: {
            id: "mem-1",
            title: "hello",
            content: "world",
            tags: ["demo"],
            owner_id: "owner-1",
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z",
          },
          status: 200,
          statusText: "OK",
          headers: {},
          config,
          request: {},
        };
      }
      throw new Error("unexpected url");
    });

    const created = await client.upsertMemory({
      ownerId: "owner-1",
      title: "hello",
      content: "world",
      tags: ["demo"],
    });

    expect(created.id).toBe("mem-1");
    expect(created.ownerId).toBe("owner-1");
    expect(created.tags).toEqual(["demo"]);
  });

  it("searches and maps results", async () => {
    const client = new MemoryNodeClient("https://worker.memorynode.ai", { apiKey: "key", ownerId: "owner-1" });

    installMockAdapter(client, async (config) => {
      if (config.url?.includes("/search")) {
        return {
          data: {
            matches: [
              {
                id: "mem-2",
                title: "foo",
                content: "bar",
                tags: [],
                owner_id: "owner-1",
              },
            ],
            cursor: null,
          },
          status: 200,
          statusText: "OK",
          headers: {},
          config,
          request: {},
        };
      }
      throw new Error("unexpected url");
    });

    const result = await client.searchMemories({ query: "foo" });
    expect(result.items[0].id).toBe("mem-2");
    expect(result.cursor).toBeNull();
  });
});
