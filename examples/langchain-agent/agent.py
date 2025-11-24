import os
from typing import Any, Dict, List

from langchain.tools import BaseTool
from memorynode_sdk import MemoryNodeClient


class MemoryIngestTool(BaseTool):
    name = "memorynode_ingest"
    description = "Ingest a memory (text) into MemoryNode for the configured owner."

    def __init__(self, client: MemoryNodeClient, owner_id: str):
        super().__init__()
        self.client = client
        self.owner_id = owner_id

    async def _arun(self, content: str, title: str = "", tags: List[str] | None = None) -> str:  # type: ignore[override]
        rec = await self.client.upsert_memory(
            title=title or "Untitled",
            content=content,
            tags=tags or [],
            owner_id=self.owner_id,
        )
        return f"ingested:{rec.id}"

    def _run(self, *args: Any, **kwargs: Any) -> str:
        raise NotImplementedError("Use async mode")


class MemorySearchTool(BaseTool):
    name = "memorynode_search"
    description = "Search memories in MemoryNode for the configured owner."

    def __init__(self, client: MemoryNodeClient, owner_id: str):
        super().__init__()
        self.client = client
        self.owner_id = owner_id

    async def _arun(self, query: str, top_k: int = 5) -> str:  # type: ignore[override]
        result = await self.client.search_memories(
            query=query,
            owner_id=self.owner_id,
            top_k=top_k,
        )
        return "\n".join([f"{m.id}: {m.content}" for m in result["items"]])

    def _run(self, *args: Any, **kwargs: Any) -> str:
        raise NotImplementedError("Use async mode")


async def get_tools() -> List[BaseTool]:
    api_key = os.environ.get("MEMORYNODE_API_KEY")
    owner_id = os.environ.get("MEMORYNODE_OWNER_ID")
    if not api_key or not owner_id:
        raise RuntimeError("Set MEMORYNODE_API_KEY and MEMORYNODE_OWNER_ID")

    client = MemoryNodeClient(api_key=api_key, owner_id=owner_id)
    return [
        MemoryIngestTool(client, owner_id),
        MemorySearchTool(client, owner_id),
    ]
