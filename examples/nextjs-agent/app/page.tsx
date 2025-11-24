"use client";

import { useState } from "react";
import { MemoryNodeClient } from "memorynode";

const baseUrl = "https://worker.memorynode.ai";

export default function Page() {
  const [ownerId] = useState<string>(process.env.NEXT_PUBLIC_MEMORYNODE_OWNER_ID || "");
  const [apiKey] = useState<string>(process.env.NEXT_PUBLIC_MEMORYNODE_API_KEY || "");
  const [title, setTitle] = useState("Hello MemoryNode");
  const [content, setContent] = useState("The quick brown fox jumps over the lazy dog.");
  const [query, setQuery] = useState("brown fox");
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const client = new MemoryNodeClient(baseUrl, {
    apiKey,
    ownerId,
  });

  const run = async () => {
    setLoading(true);
    setError("");
    try {
      const mem = await client.upsertMemory({
        ownerId,
        title,
        content,
        tags: ["demo"],
      });
      const search = await client.searchMemories({ ownerId, query });
      setResult(
        `Ingested id=${mem.id}. Search returned ${search.items.length} item(s): ${search.items
          .map((i) => `${i.id}:${i.content}`)
          .join(", ")}`,
      );
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 640, margin: "40px auto", fontFamily: "Inter, sans-serif" }}>
      <h1>MemoryNode Next.js Agent (Phase-1)</h1>
      <p>Base URL: {baseUrl}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "16px" }}>
        <label>
          Title
          <input
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label>
          Content
          <textarea
            style={{ width: "100%", padding: "8px", marginTop: "4px", minHeight: "80px" }}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </label>
        <label>
          Query
          <input
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <button
          style={{ padding: "10px 14px", background: "#111827", color: "white", borderRadius: "8px", border: "none" }}
          onClick={run}
          disabled={loading}
        >
          {loading ? "Running..." : "Ingest & Search"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {result && <p style={{ color: "green" }}>{result}</p>}
      </div>
      <p style={{ marginTop: "24px", fontSize: "12px" }}>
        Set env vars: NEXT_PUBLIC_MEMORYNODE_API_KEY, NEXT_PUBLIC_MEMORYNODE_OWNER_ID.
      </p>
    </main>
  );
}
