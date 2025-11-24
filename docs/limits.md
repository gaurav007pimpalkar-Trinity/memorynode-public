# Limits (Phase-1)

- Rate limits: per-key quotas apply. If exceeded, responses return HTTP 429.
- Retry guidance: use exponential backoff (e.g., 0.5s, 1s, 2s) on 429s.
- Headers: standard HTTP 429 responses may include `Retry-After` when applicable.
