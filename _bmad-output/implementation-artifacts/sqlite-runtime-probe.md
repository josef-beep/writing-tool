# Electron SQLite compatibility probe

Verified locally on 2026-10-17, Linux x64: Electron44.9.0's actual utility process loaded built-in `node:sqlite`, reporting Node24.22.0 and SQLite3.53.4. A temporary on-disk database used WAL/FULL; a TEXT generation above JavaScript's safe integer range (`9007199254740993`) survived online backup and read-only reopening, with `PRAGMA integrity_check` returning `ok`.

Separate utility processes used a dedicated rollback-mode lease database. The first held BEGIN EXCLUSIVE; a second was denied with SQLite BUSY code5; after terminating the holder, a new process acquired ownership. No writing/project files or application source were changed. Raw probe scripts reside under `/tmp/writingtool-electron-sqlite.D7xE12` (temporary, not a durable test suite).

Observed result:

```json
{"electron":"44.9.0","node":"24.22.0","ok":true,"sqlite":"3.53.4","generation":"9007199254740993","integrity":"ok","onlineBackup":true,"secondOwnerDenied":true,"errorCode":5,"ownershipAfterTermination":true}
```

This supports selecting the bundled SQLite API for the next local persistence slice without an additional native compiler/addon. It is not yet a packaged application adapter, migration/fencing/publication crash test or Windows/macOS proof. TECH-02/04/11/12 remain open. The application must keep SQL/filesystem authority in the utility host and preserve the established JSON/catalog ownership contract.

API reference checked against the bundled Node version: [Node24.22.0 SQLite documentation](https://github.com/nodejs/node/blob/v24.22.0/doc/api/sqlite.md). Keep the binding behind a port and pinned with Electron; the upstream API is marked release candidate.
