# BYOK encryption with AES-256-GCM

The user's AI provider API key is encrypted at rest using AES-256-GCM, with a key derived from `APP_ENCRYPTION_KEY`. The key is only decrypted in backend code at the moment of making an API call to the provider. The browser never sees the raw key.

Alternatives considered: leaving keys in environment variables (no encryption at rest), using a vault service (complexity overhead for a self-hosted single-user tool). The chosen approach balances security with simplicity — the encryption key is a single env var, and the cipher is standard and well-understood.
