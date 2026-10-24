# Development checker EPIPE — 2026-10-24

User-provided [screenshot](screenshot.png) shows two `Error: write EPIPE` reports after the terminal's shell prompt. Both stacks pass through Node's child-process `target.send` and `fork-ts-checker-webpack-plugin/lib/rpc/expose-rpc.js:27:31`, with `errno: -32`, `code: EPIPE`, `syscall: write`.

The installed plugin is version 9.1.0. Its `expose-rpc.js` sends completed worker results with `process.send`, checking `process.connected` before sending. If the IPC write fails, the callback rejects; the surrounding handler catches that rejection and prints the send error with `console.error`. That matches the screenshot. A connection can close between its preflight check and the actual send.

The repository enables this separate-process TypeScript checker in `webpack.plugins.ts`, shared by the main and renderer webpack configurations. The plugin registers worker termination on compiler shutdown/watch-close, and its RPC worker implementation terminates child processes with SIGTERM. A worker reply racing with parent termination is therefore a plausible explanation. The screenshot's returned prompt supports that interpretation, but does not establish the original command, whether shutdown was intentional, or whether another failure caused the parent to exit. Two printed errors alone do not establish which worker/compiler instances produced them.

This stack identifies development/build worker communication. It does not itself identify a manuscript save or SQLite failure, and it does not establish the state of writing data. No corresponding `EPIPE` occurrence was found in the retained full-test text/JSON outputs. The earlier passing checks therefore do not reproduce or resolve this report.

Tracked as BUG-05. Reproduction needs the preceding command/output and exit path; verify normal app close, interrupted development/build commands and worker shutdown with temporary writing data. Preserve genuine compiler diagnostics. No application source, dependency or generated bundle was changed for this investigation. The working tree already contained newer `.webpack` changes when the screenshot was investigated; those were left untouched.
