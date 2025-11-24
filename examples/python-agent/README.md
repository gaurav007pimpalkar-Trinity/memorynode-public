# MemoryNode Python Agent (Phase-1)

Minimal script that ingests a note and searches it via the MemoryNode Python SDK.

## Env vars
- `MEMORYNODE_API_KEY`
- `MEMORYNODE_OWNER_ID`

## Run
```bash
pip install memorynode-sdk
# or: pip install -e ../../packages/sdk-python
python ingest_then_search.py
```

Base URL is fixed to `https://worker.memorynode.ai`.
