# MemoryNode - Cloud Memory API (Public)

## Tagline
Durable memory for AI agents and apps via a simple, cloud-first API.

## Features
- Cloud-only worker endpoints
- Simple primitives: `/ingest` and `/search`
- Fast start with JS and Python SDKs

## Quickstart
1) Create an API key in the console.  
2) Ingest: POST `/ingest` with `ownerId` and content.  
3) Search: POST `/search` with a query and `ownerId`.

## SDK usage
- Install:  
  - JS: `npm install memorynode`  
  - Python: `pip install memorynode-sdk`
- Base URL: `https://worker.memorynode.ai`
- Calls: `upsertMemory` / `searchMemories` (JS) or `upsert_memory` / `search_memories` (Python)

## Docs
- [docs/openapi.yaml](docs/openapi.yaml)
- [docs/quickstart.md](docs/quickstart.md)
- [docs/api.md](docs/api.md)
- [docs/limits.md](docs/limits.md)

## Examples
- [examples/nextjs-agent](examples/nextjs-agent)
- [examples/python-agent](examples/python-agent)
- [examples/langchain-agent](examples/langchain-agent)

## Support
- Open issues in this public repo.
- For production help, use the MemoryNode console.
