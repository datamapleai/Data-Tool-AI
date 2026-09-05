# Two-phase auto-fill

When creating a Resource from a URL, metadata (title, description, favicon) is fetched synchronously via `/api/preview`. If the user has configured an AI provider, a richer summary is generated asynchronously and updates the Resource after save.

This avoids blocking the user on slow AI calls while still providing enhanced metadata when available. The synchronous phase uses specialized APIs (GitHub, npm, YouTube oEmbed) with generic scraping as fallback. The async phase is best-effort — the Resource is usable without it.
