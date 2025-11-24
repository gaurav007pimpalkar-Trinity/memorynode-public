# MemoryNode LangChain Tools (Phase-1)

Minimal LangChain tools wrapping MemoryNode ingest and search. Phase-1 only, worker endpoints.

## Env vars
- `MEMORYNODE_API_KEY`
- `MEMORYNODE_OWNER_ID`

## Install
```bash
pip install memorynode-sdk langchain
```

## Usage
```python
import asyncio
from agent import get_tools


async def main():
    tools = await get_tools()
    # tools[0] = ingest, tools[1] = search
    print(await tools[0].arun(content="The quick brown fox", title="Note"))
    print(await tools[1].arun(query="brown fox"))


asyncio.run(main())
```

Base URL is fixed to `https://worker.memorynode.ai`. No Phase-2/legacy endpoints are used.
