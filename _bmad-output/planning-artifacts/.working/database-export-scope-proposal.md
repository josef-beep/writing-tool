# Approved database-export scope and workflow

Status: approved by Jo on 2026-10-17. Related: FR-49, Story 6.2, TECH-13, Experience Flow 14. Existing complete ZIP backup behavior remains approved.

## Adopted scope

Export one selected owning project or standalone-universe catalog as a consistent `.sqlite` snapshot. The source identity and its owning scope must be shown before export. Do not combine independent live authorities or include unrelated units because names or paths match. A project catalog may reference its owning shared universe; those references do not silently export that universe's separate catalog/content.

Include the selected catalog's saved IDs, ownership, relationships, schema/version information and stored relative object paths/root identities. Preserve genuine external reference/dependency information; do not rewrite an export as a new live authority. Exporting a catalog is not an application import/restore feature.

**Exclude external JSON object files, WRT manuscript text, chapter-formatting JSON, images and revision/backup payloads.** The dialog must explain: “Database catalog only. Writing, object files and images are not included. Use a complete ZIP backup for independent recovery.” Do not imply external data is embedded in the database or that the catalog file is independently recoverable.

## Adopted interaction

1. Export > Database opens the center export surface. Show one source identity, scope and the dependency notice before confirmation. If no supported source is active, explain why export is unavailable.
2. Protect pending edits using the existing manuscript automatic-save and manual-editor Save/Discard/Cancel rules before capture. Save failure retains edits and blocks capture; Cancel preserves live state.
3. Save As chooses a local `.sqlite` destination. Suggest a filesystem-safe source name plus `_catalog.sqlite`. Confirm replacement; declining returns to Save As. Reject the live catalog or another active source file as destination.
4. Show center progress and supported Cancel. Capture a consistent saved catalog under the accepted capture/writer contracts, validate a temporary output, then publish it. Preserve an existing destination on cancellation/failure. Never report partial output as successful.
5. On success show actual saved path, Open file and Open folder plus the catalog-only limitation. Failure offers Retry / Choose another location / Cancel. Return to writing after the operation reaches its outcome, preserving the original chapter context.

## Remaining technical work

Approval settles product scope and UX; TECH-13 remains open for the technical contract. Define versioned export metadata/schema compatibility, the consistent SQLite capture/validation mechanism, capture generation and pending-edit boundary, safe destination/publication protocol, cancellation boundary, ownership filtering/validation and external-dependency representation before implementation. Retain all applicable TECH-01–04/11 gates. No code, capture or platform test has run.
