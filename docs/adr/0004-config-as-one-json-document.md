# 0004. App config as one JSON document

Status: accepted

## Context

An app is a list of widgets and queries that the editor changes constantly and the runtime renders. Storing it as normalized rows (widget, property, query tables) would need joins and ordering columns for every read, and many small writes for every edit.

## Decision

An app is one JSON document in `apps.config` (`jsonb`), with `version: 1`, a `queries` array and a `widgets` array whose order is the grid order. The Zod schema in `packages/config` validates it on the client and on the server. `saveApp` parses the whole document, rejects invalid ones with `BAD_USER_INPUT`, and writes with an optimistic check on `updatedAt`; a stale write returns a `VersionConflict` with the latest app. Widget and query ids share one expression scope and must be unique across both; `parseAppConfig` rejects duplicates.

## Consequences

- Loading, saving, copying a template and sharing the shape between web and api are one read or write.
- The editor state is the same object that is stored, so autosave sends the config as it is.
- The database cannot query inside widgets or enforce references (for example a row action pointing at a missing mutation). The runtime reports those as errors instead.
- Concurrent edits are resolved per app, not per widget: the second writer gets a conflict and chooses Reload or Overwrite.
- A format change needs a `version` bump and a migration of stored documents.
