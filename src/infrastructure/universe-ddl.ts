// Version one creates only Story 1.2 authority, profile indexing and durable receipts.
export const CATALOG_DDL = `
PRAGMA application_id=1465140300;
PRAGMA user_version=1;
CREATE TABLE unit_meta (singleton INTEGER PRIMARY KEY CHECK(singleton=1), schemaVersion INTEGER NOT NULL CHECK(schemaVersion=1), ownerId TEXT NOT NULL, rootId TEXT NOT NULL, generation TEXT NOT NULL, sessionToken TEXT NOT NULL, creationOperationId TEXT NOT NULL, creationDigest TEXT NOT NULL, creationState TEXT NOT NULL CHECK(creationState IN ('preparing','complete')));
CREATE TABLE root_locations (rootId TEXT PRIMARY KEY, ownerKind TEXT NOT NULL CHECK(ownerKind='universe'), ownerId TEXT NOT NULL, basePath TEXT NOT NULL, bindingVersion TEXT NOT NULL);
CREATE TABLE records (id TEXT PRIMARY KEY, rootId TEXT NOT NULL REFERENCES root_locations(rootId), recordType TEXT NOT NULL CHECK(recordType='universe-profile'), relativePath TEXT NOT NULL UNIQUE, recordVersion TEXT NOT NULL, sha256 TEXT NOT NULL);
CREATE TABLE committed_operations (operationId TEXT PRIMARY KEY, requestDigest TEXT NOT NULL, generation TEXT NOT NULL, resultDigest TEXT NOT NULL, receiptData TEXT NOT NULL);
`;
export const LEASE_DDL = `PRAGMA application_id=1465140300; PRAGMA user_version=1; CREATE TABLE lease_identity (singleton INTEGER PRIMARY KEY CHECK(singleton=1), schemaVersion INTEGER NOT NULL CHECK(schemaVersion=1), ownerId TEXT NOT NULL, rootId TEXT NOT NULL);`;
