# Data Tool AI

A personal, self-hosted repository of curated bookmarks and tools for tech professionals, with AI-assisted cataloging and search.

## Language

**Resource**:
A curated bookmark — a URL the user has saved and enriched with metadata (title, description, category, tags, status, rating). The central entity of the system.
_Avoid_: Item, entry, link, bookmark (use Resource for the entity; "bookmark" only for the act of saving)

**Category**:
A top-level grouping for Resources, with an icon and color. Resources belong to exactly one Category. Categories are user-editable and ordered via drag-and-drop.
_Avoid_: Group, collection, folder

**Subcategory**:
A second-level grouping within a Category. Plain text, no icon or color. Used for finer-grained browsing via a second row of filter chips. No deeper nesting.
_Avoid_: Tag, sub-group

**Tag**:
A free-form, flat label applied to Resources. Orthogonal to Categories — a Resource has one Category but many Tags. Used for cross-cutting concerns (e.g., "free", "self-hosted", "api-only").
_Avoid_: Label, keyword

**InboxItem**:
A URL in the triage queue. Created by quick-capture or import. Not yet categorized or annotated. Promoted to a Resource or discarded. Items are auto-filled in the background after import.
_Avoid_: Draft, pending item

**ResourceLink**:
A typed URL associated with a Resource beyond its primary URL. Types are fixed: site, github, docs, video, twitter, hf, download, outro.
_Avoid_: Alternate URL, secondary link

**Review**:
A personal annotation on a Resource — a rating (1-5) and optional comment. Author and sole reader is the resource owner. Serves as a memory aid for tool quality and use cases.
_Avoid_: Rating, feedback, evaluation

**User**:
The single owner of the instance. In v1, there is exactly one User. The userId foreign keys exist for future multi-user support.
_Avoid_: Account, member

**UserSettings**:
Per-user configuration: AI provider credentials (BYOK, encrypted at rest), theme preference (light/dark), default view (grid/list).
_Avoid_: Preferences, config

**AppConfig**:
System-level state — currently just tracks whether the installation wizard has completed (installedAt timestamp).
_Avoid_: System config, settings

**Auto-fill**:
The process of fetching metadata (title, description, favicon) from a URL when creating a Resource. Phase 1 is synchronous scraping; Phase 2 is optional async AI-generated summary.
_Avoid_: Preview, fetch, scrape

**BYOK**:
Bring Your Own Key — the user provides their own AI provider API key. The system never embeds or intermediates keys. Encrypted at rest via AES-256-GCM.
_Avoid_: API key, credentials

**Triage**:
The act of processing InboxItems — reviewing auto-filled metadata, assigning a Category and Tags, and promoting to a Resource (or discarding).
_Avoid_: Review, process
