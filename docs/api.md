# MemoryNode API (Phase-1)

Base URL: `https://worker.memorynode.ai`  
Auth: `Authorization: Bearer <API_KEY>`

---

## POST /ingest
What it does: Stores a memory for an owner.

Required fields:
- `ownerId` (string)
- `content` (string)

Optional fields:
- `title` (string)
- `tags` (array[string])
- `metadata` (object)
- `attachmentIds` (array[string])

Example (curl):
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

Example response:
```json
{
  "id": "mem-123",
  "ownerId": "owner-123",
  "title": "Hello MemoryNode",
  "content": "The quick brown fox.",
  "tags": ["demo"],
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

## POST /search
What it does: Semantic search of memories for an owner.

Required fields:
- `ownerId` (string)
- `query` (string)

Optional fields:
- `topK` (integer, default 5)
- `tags` (array[string])
- `filters` (object)
- `cursor` (string|null)

Example (curl):
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

Example response:
```json
{
  "matches": [
    {
      "id": "mem-123",
      "score": 0.92,
      "title": "Hello MemoryNode",
      "content": "The quick brown fox.",
      "tags": ["demo"],
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

## POST /admin/api-keys
What it does: Admin-only API key creation. Requires `x-admin-key`.

Required fields:
- Header: `x-admin-key`
- Body: `ownerId` (string)

Optional fields:
- Body: `label` (string)

Example (curl):
```bash
curl -X POST "https://worker.memorynode.ai/admin/api-keys" \
  -H "x-admin-key: <ADMIN_KEY>" \
  -H "content-type: application/json" \
  -d '{"ownerId":"owner-123","label":"cloud dev"}'
```

Example response:
```json
{
  "token": "mnk_abc123..."
}
```

---

## GET /health
What it does: Returns service health status.

Example (curl):
```bash
curl -X GET "https://worker.memorynode.ai/health"
```

Example response:
```json
{
  "status": "ok"
}
```

See `openapi.yaml` for the full schema definitions.
