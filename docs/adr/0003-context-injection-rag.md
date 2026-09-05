# Context injection for catalog-aware chat

The AI assistant is made aware of the user's catalog by injecting a compact JSON summary of all Resources (title, category, tags, description) into the system prompt. No vector database, no embeddings pipeline.

This is sufficient for a personal catalog (expected <1000 resources). If the catalog outgrows the context window, the strategy will be revisited with embeddings-based RAG. The chosen approach avoids infrastructure complexity (no embedding model, no vector store) while delivering the core value: the assistant can answer "what tool did I save for X?"
