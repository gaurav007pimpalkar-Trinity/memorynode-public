# Quickstart (Cloud-Only)

3 steps in 60 seconds: create key → ingest → search.

1) Create a key  
- Console: https://app.memorynode.ai (API Keys)  
- Admin: `POST https://worker.memorynode.ai/admin/api-keys` with `x-admin-key`

2) Ingest (curl)
```bash
curl -X POST "https://worker.memorynode.ai/ingest" \
  -H "authorization: Bearer <API_KEY>" \
  -H "content-type: application/json" \
  -d '{
    "ownerId": "owner-123",
    "title": "Hello MemoryNode",
    "content": "The quick brown fox.",
    "tags": ["demo"]
  }'
```

3) Search (curl)
```bash
curl -X POST "https://worker.memorynode.ai/search" \
  -H "authorization: Bearer <API_KEY>" \
  -H "content-type: application/json" \
  -d '{
    "ownerId": "owner-123",
    "query": "brown fox",
    "topK": 5
  }'
```

JS SDK
```ts
import { MemoryNodeClient } from "memorynode";

const client = new MemoryNodeClient("https://worker.memorynode.ai", {
  apiKey: process.env.MEMORYNODE_API_KEY,
  ownerId: "owner-123",
});

await client.upsertMemory({
  title: "Hello MemoryNode",
  content: "The quick brown fox.",
  tags: ["demo"],
});

const results = await client.searchMemories({ query: "brown fox" });
console.log(results.items);
```

Python SDK
```python
import asyncio
from memorynode_sdk import MemoryNodeClient


async def main():
    client = MemoryNodeClient(api_key="YOUR_API_KEY", owner_id="owner-123")
    try:
        await client.upsert_memory(
            title="Hello MemoryNode",
            content="The quick brown fox.",
            tags=["demo"],
        )
        result = await client.search_memories(query="brown fox")
        print(result["items"])
    finally:
        await client.aclose()


asyncio.run(main())
```
