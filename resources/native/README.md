Forge builds the trusted filesystem addon on the matching Windows/macOS host and copies it under `confined-fs/<platform>-<arch>/`. These resources stay outside ASAR. Installed applications load the bundled binary and never invoke a compiler. Linux retains its descriptor-relative JavaScript implementation.

Generated binaries and build receipts are ignored. See [native source and limitations](../../native/confined-fs/README.md), including the unverified Windows NTFS directory flush and native platform gates.
