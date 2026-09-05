# Import to triage queue

Imported bookmarks (browser HTML, CSV) are not created directly as Resources. They land in the InboxItem triage queue, where background auto-fill enriches them and the user manually promotes or discards each one.

This respects the triage workflow: import is fast and non-blocking, and the user retains control over what enters their catalog. It also avoids polluting the Resource collection with unreviewed, unannotated entries.
