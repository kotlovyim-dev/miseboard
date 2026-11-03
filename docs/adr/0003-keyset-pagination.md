# 0003. Keyset pagination

Status: accepted

## Context

Orders are listed newest first and new orders arrive while a user pages through the list. Offset pagination skips or repeats rows when rows are inserted, and its cost grows with the offset.

## Decision

`orders` uses forward cursor pagination (`first`, `after`). A cursor is the base64url encoding of the order's `createdAt` and `id`. The query orders by `created_at desc, id desc` and filters with a row comparison `(created_at, id) < (cursor.createdAt, cursor.id)`. It fetches `first + 1` rows to compute `hasNextPage`. `first` defaults to 20 and is capped at 100. An index on `(venue_id, created_at desc, id)` supports the per-venue case. Cursors are validated on decode and a malformed one returns `BAD_USER_INPUT`.

## Consequences

- Pages stay stable when orders are inserted, and each page costs about the same regardless of depth.
- Cursors are opaque to clients, so the sort key can change without changing the API shape.
- Only forward paging is supported. `hasPreviousPage` is always `false`; backward paging would need `last` and `before`.
- Jumping to page N is not possible. The table widget pages in the browser over the rows it was given.
- `totalCount` runs a separate `count` query for the same filters.
