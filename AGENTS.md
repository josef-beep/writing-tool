<!-- bmad:context -->
<!-- Verified 2026-10-22 against 03687967ba70c0adf49e746b5fa3eddbce997421 plus the current planning working tree. Managed by bmad-project-context; refresh against the recorded evidence. -->

## WritingTool

WritingTool is a local Electron/TypeScript/React/Lexical writing application. The canonical product contract is `_bmad-output/specs/spec-WritingTool/SPEC.md` together with its companions. For implementation or acceptance work, read `TODO.md` and `_bmad-output/RESUME.md` for the current handoff.

## Policy

- Follow `_bmad-output/planning-artifacts/execution-approval.md`: continue approved engineering without routine signoffs; ask for material scope changes, necessary unavailable information or new external commitments.
- Verify with temporary profiles, projects and universes; preserve real writing, pre-existing changes and session-generated `.webpack` files.
- Record acceptance evidence before marking stories or technical/platform gates complete; source presence and focused local tests do not establish release acceptance.

## Where things are

- Trace desktop behavior through `src/desktop/main.ts`, `src/desktop/preload.ts` and `src/desktop/utility-host.ts`; keyboard classification lives in `src/presentation/keyboard.ts`.
- For persistence, recovery or export changes, read `_bmad-output/specs/spec-WritingTool/planning-contract-index.md` and its applicable contracts before changing publication or authority behavior.

## Running and verifying

- Run commands from the repository root with Node >=22.16.0; use `package.json` and `README.md` for setup and script names. The test command does not run typecheck or lint.
- Target Node tests directly: `node --import tsx tests/workspace-domain.test.ts` (also supports `.tsx`); use `node tests/smoke.test.mjs` for runner tests. Appended npm test arguments do not filter the chained suite.
- Target desktop checks with `npm run test:desktop -- writing menus error-quit`; these compile fresh temporary bundles and retain temporary evidence. Provide a working display; build the native addon first on macOS/Windows because this runner bypasses Forge hooks.
- Run Forge development, smoke and packaging sequentially because they share `.webpack`; packaged smoke requires a freshly built bundle. Keep Electron's sandbox enabled.
- Do not blindly rerun resource setup over `resources/libreoffice`; preserve the existing setup and follow `scripts/setup-resources.mjs`. A successful Linux native-build command skips addon compilation and proves nothing about Windows/macOS.

## Conventions that differ from defaults

- Keep dependencies inward: domain has no UI/host/I/O imports; renderer uses the isolated typed bridge, and application use cases coordinate authoritative writes.
- Preserve one live universe authority, permanent IDs and relative object paths. Publish matched WRT text, companion JSON formatting and catalog state through the existing storage/coordinator protocol.
- Use closed runtime validators and retain original operation IDs/payloads after uncertain acknowledgment. Capture acknowledged saved generations; retries reuse their original immutable cut and retain protected references.
- Chapter date edits and chapter-only recovery leave linked canonical event data unchanged; recovery requires protective Replaced capture and freshness validation.

## Known pitfalls

- A failed saved-copy operation may be set aside only for capture/backup/export while retaining its evidence; never use that escape to unlock unknown live saves or recovery.
- Preserve the separately confirmed error-exit path, bounded recovery-copy collection and explicit incomplete-copy choice. A canceled close clears only its own drain lock; interrupted exit is never successful save/backup/reconciliation.
- Reuse shared keyboard classification and verify actual focus/listener behavior; overlapping Save, close, zoom and dialog handlers have caused regressions.

<!-- /bmad:context -->
