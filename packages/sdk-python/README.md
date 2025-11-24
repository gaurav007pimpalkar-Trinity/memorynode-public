# MemoryNode Python SDK (Phase-1)

Cloud-first SDK for MemoryNode. Targets the worker endpoints only (`/ingest`, `/search`) with HTTPS defaults.

## Install
```bash
pip install memorynode-sdk
```

## Usage (ingest)
```python
import asyncio
from memorynode_sdk import MemoryNodeClient


async def main():
    client = MemoryNodeClient(api_key="YOUR_API_KEY", owner_id="owner-123")
    try:
        rec = await client.upsert_memory(
            title="Hello",
            content="World",
            tags=["demo"],
        )
        print(rec)
    finally:
        await client.aclose()


asyncio.run(main())
```

## Usage (search)
```python
import asyncio
from memorynode_sdk import MemoryNodeClient


async def main():
    client = MemoryNodeClient(api_key="YOUR_API_KEY", owner_id="owner-123")
    try:
        result = await client.search_memories(query="Hello")
        print(result["items"])
    finally:
        await client.aclose()


asyncio.run(main())
```

## Notes
- Base URL defaults to `https://worker.memorynode.ai`.
- Only Phase-1 methods are available: `upsert_memory`, `search_memories`.
- Paused features (listing, deleting, DSAR, router, tiers, etc.) are intentionally omitted.
- `owner_id` can be provided at client init or per call (per call overrides init).
