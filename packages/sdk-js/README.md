# MemoryNode JavaScript SDK (Phase-1)

Cloud-first SDK for MemoryNode. Targets the worker endpoints only (`/ingest`, `/search`), with HTTPS defaults.

## Install
```bash
npm install memorynode
```

## Usage (ingest)
```ts
import { MemoryNodeClient } from "memorynode";

const client = new MemoryNodeClient("https://worker.memorynode.ai", {
  apiKey: process.env.MEMORYNODE_API_KEY,
  ownerId: "owner-123",
});

await client.upsertMemory({
  title: "Hello",
  content: "World",
  tags: ["demo"],
});
```

## Usage (search)
```ts
const results = await client.searchMemories({
  query: "Hello",
  ownerId: "owner-123", // optional if provided in constructor
});

console.log(results.items);
```

## Notes
- Base URL defaults to `https://worker.memorynode.ai`.
- Only Phase-1 methods are available: `upsertMemory`, `searchMemories`.
- Paused features (listing, deleting, DSAR, router, tiers, etc.) are intentionally omitted.
