from __future__ import annotations

import asyncio
from dataclasses import dataclass
from typing import Any, Dict, List, Optional

import httpx

DEFAULT_BASE_URL = "https://worker.memorynode.ai"


class MemoryNodeError(Exception):
    """Generic SDK error."""


@dataclass
class MemoryRecord:
    id: str
    title: str
    content: str
    tags: List[str]
    owner_id: str
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


class MemoryNodeClient:
    def __init__(
        self,
        base_url: str = DEFAULT_BASE_URL,
        api_key: Optional[str] = None,
        owner_id: Optional[str] = None,
        timeout: float = 15.0,
        max_retries: int = 2,
        backoff_seconds: float = 0.5,
    ) -> None:
        self.base_url = base_url.rstrip("/") or DEFAULT_BASE_URL
        self.api_key = api_key
        self.default_owner_id = owner_id
        self.timeout = timeout
        self.max_retries = max_retries
        self.backoff_seconds = backoff_seconds

        headers = {"Content-Type": "application/json"}
        if api_key:
            headers["Authorization"] = f"Bearer {api_key}"

        self._client = httpx.AsyncClient(
            base_url=self.base_url,
            headers=headers,
            timeout=self.timeout,
        )

    async def aclose(self) -> None:
        await self._client.aclose()

    def _resolve_owner(self, owner_id: Optional[str]) -> str:
        resolved = owner_id or self.default_owner_id
        if not resolved:
            raise MemoryNodeError("owner_id is required")
        return resolved

    async def _request_with_retry(self, method: str, url: str, **kwargs: Any) -> httpx.Response:
        last_exc: Exception | None = None
        for attempt in range(self.max_retries + 1):
            try:
                resp = await self._client.request(method, url, **kwargs)
                if resp.status_code >= 400:
                    raise MemoryNodeError(f"{resp.status_code} {resp.text}")
                return resp
            except Exception as exc:  # noqa: BLE001
                last_exc = exc
                if attempt == self.max_retries:
                    break
                await asyncio.sleep(self.backoff_seconds * (attempt + 1))
        raise MemoryNodeError(f"Request failed after retries: {last_exc}") if last_exc else MemoryNodeError(
            "Request failed",
        )

    def _map_record(self, raw: Dict[str, Any]) -> MemoryRecord:
        return MemoryRecord(
            id=raw.get("id", ""),
            title=raw.get("title", ""),
            content=raw.get("content", ""),
            tags=raw.get("tags") or [],
            owner_id=raw.get("owner_id") or raw.get("ownerId") or "",
            created_at=raw.get("created_at") or raw.get("createdAt"),
            updated_at=raw.get("updated_at") or raw.get("updatedAt"),
        )

    async def upsert_memory(
        self,
        *,
        title: str,
        content: str,
        tags: Optional[List[str]] = None,
        owner_id: Optional[str] = None,
    ) -> MemoryRecord:
        resolved_owner = self._resolve_owner(owner_id)
        body = {
            "ownerId": resolved_owner,
            "title": title,
            "content": content,
            "tags": tags or [],
        }
        resp = await self._request_with_retry("POST", "/ingest", json=body)
        return self._map_record(resp.json())

    async def search_memories(
        self,
        *,
        query: str,
        owner_id: Optional[str] = None,
        top_k: int = 5,
        filter_tags: Optional[List[str]] = None,
        cursor: Optional[str] = None,
    ) -> Dict[str, Any]:
        resolved_owner = self._resolve_owner(owner_id)
        body = {
            "ownerId": resolved_owner,
            "query": query,
            "topK": top_k,
            "filterTags": filter_tags or [],
            "cursor": cursor,
        }
        resp = await self._request_with_retry("POST", "/search", json=body)
        data = resp.json()
        items = [self._map_record(item) for item in data.get("items", [])]
        return {"items": items, "cursor": data.get("cursor")}
