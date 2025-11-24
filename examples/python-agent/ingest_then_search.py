import asyncio
import os

from memorynode_sdk import MemoryNodeClient


async def main():
    api_key = os.environ.get("MEMORYNODE_API_KEY")
    owner_id = os.environ.get("MEMORYNODE_OWNER_ID")
    if not api_key or not owner_id:
        raise SystemExit("Set MEMORYNODE_API_KEY and MEMORYNODE_OWNER_ID")

    client = MemoryNodeClient(api_key=api_key, owner_id=owner_id)
    try:
        created = await client.upsert_memory(
            title="Hello MemoryNode",
            content="The quick brown fox jumps over the lazy dog.",
            tags=["demo"],
        )
        print(f"Ingested id={created.id}")

        result = await client.search_memories(query="brown fox")
        print(f"Found {len(result['items'])} result(s):")
        for item in result["items"]:
            print(f"- {item.id}: {item.content}")
    finally:
        await client.aclose()


if __name__ == "__main__":
    asyncio.run(main())
