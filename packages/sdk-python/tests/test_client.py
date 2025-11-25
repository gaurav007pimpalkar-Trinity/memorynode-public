import asyncio
from typing import Any, Dict

import httpx
import pytest

from memorynode_sdk import MemoryNodeClient, MemoryNodeError


class MockTransport(httpx.AsyncBaseTransport):
    def __init__(self, responder):
        self._responder = responder

    async def handle_async_request(self, request: httpx.Request) -> httpx.Response:
        return await self._responder(request)


@pytest.mark.asyncio
async def test_requires_owner():
    client = MemoryNodeClient(api_key="key")
    with pytest.raises(MemoryNodeError):
        await client.upsert_memory(title="t", content="c")
    await client.aclose()


@pytest.mark.asyncio
async def test_upsert_and_search():
    async def responder(req: httpx.Request) -> httpx.Response:
        if req.url.path.endswith("/ingest"):
            data: Dict[str, Any] = {
                "id": "mem-1",
                "title": "hello",
                "content": "world",
                "tags": ["demo"],
                "owner_id": "owner-1",
            }
            return httpx.Response(200, json=data)
        if req.url.path.endswith("/search"):
            data = {
                "matches": [
                    {
                        "id": "mem-2",
                        "title": "foo",
                        "content": "bar",
                        "owner_id": "owner-1",
                    }
                ],
                "cursor": None,
            }
            return httpx.Response(200, json=data)
        return httpx.Response(404)

    transport = MockTransport(responder)
    client = MemoryNodeClient(api_key="key", owner_id="owner-1")
    client._client._transport = transport  # type: ignore[attr-defined]

    created = await client.upsert_memory(title="hello", content="world", tags=["demo"])
    assert created.id == "mem-1"
    assert created.owner_id == "owner-1"

    result = await client.search_memories(query="foo")
    assert len(result["items"]) == 1
    assert result["items"][0].id == "mem-2"
    await client.aclose()
