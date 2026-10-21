
- source_spec: `spec-1-2-universe-folders.md`
  summary: Measure resource usage and host timeouts for representative large universe profile/decimal/JSON inputs; unverified medium resource-exhaustion concern.
  evidence: Blind finding8 identifies synchronous whole-document work but supplies no concrete failing normal-use fixture or resource measurement. DEC-11 performance/stress verification remains open; arbitrary user field/integer caps are not adopted. Record reproducible inputs/runtime/memory/latency before selecting a bounded-processing correction.

- source_spec: `spec-fix-exclusive-menus.md`
  summary: Close portaled toolbar dropdowns after their commands execute (medium, pre-existing).
  status: resolved
  resolution: See spec-fix-portaled-menu-dismissal.md; portal-aware Shell handler and pointer/keyboard Electron regression now verify command execution and menu dismissal.
  evidence: Native Electron regression executed View → Font and layout and opened Settings, but View stayed open. Baseline f8a95fcd3368832c866ab8e6d9e5979b2128694e already attaches close-on-command to Shell nav while Workspace portals render these commands; React portal clicks follow their logical ancestry. Opening another summary now closes View correctly. Command dismissal needs a separate event-handling fix.
