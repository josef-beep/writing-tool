# Manuscript export tool proposal — 2026-10-17

Status: Jo selected bundled LibreOffice on 2026-10-17. The original docx/Electron-PDF proposal below is superseded; retained as research history. Documentation inspection only, no integration or installed-output verification.

- DOCX: `docx` TypeScript/JavaScript generation library. Official documentation covers Word generation, paragraph spacing, indentation and page breaks; repository license is MIT. Sources: https://docx.js.org/ ; https://docx.js.org/api/types/ISpacingProperties.html ; https://docx.js.org/api/types/index.IParagraphPropertiesOptionsBase.html ; https://github.com/dolanmiu/docx/blob/master/LICENSE .
- PDF: Electron `webContents.printToPDF`, using controlled local HTML/CSS derived from the matched application-owned manuscript snapshot. Official documentation exposes A4, margins and print configuration: https://www.electronjs.org/docs/latest/api/web-contents#contentsprinttopdfoptions . Reuses the adopted desktop runtime. This is an architecture recommendation, not proof of approved typography output on every platform.
- Markdown/TXT: application-owned TypeScript serializers implementing the accepted mappings; no extra conversion dependency proposed. Escape literal Markdown punctuation separately from generated formatting, including ensuring approved scene markers display as intended.

Maintain Clean Architecture: conversion ports in application, adapters outside domain, bounded Electron-main PDF service coordinated through the existing host; direct serializers/docx can run in infrastructure. Do not move authoritative writes into a renderer or grant manuscript content filesystem access.

Pin the actual compatible docx/runtime versions and validate bundling under TECH-12 before adoption of a lockfile. Verify Unicode/font coverage, 12-point serif typography, A4/margins/spacing, chapter pagination, styles, empty chapters, scene markers, text order and installed outputs on the accepted platform matrix. Exact cross-platform serif font/packaging remains an implementation detail to verify; generic serif alone is not a guarantee of identical pagination between readers/platforms. No need for Word/LibreOffice or an online conversion service is proposed.

## LibreOffice alternative — requested by Jo, not yet selected

Jo asked whether LibreOffice can be used. Official documentation confirms headless execution, command-line conversion, separate user profiles, Writer DOCX/PDF output filters and ODF/FODT input. Sources: https://help.libreoffice.org/latest/en-US/text/shared/guide/start_parameters.html ; https://help.libreoffice.org/latest/en-US/text/shared/guide/convertfilters.html .

Possible design: build a styled temporary document from the matched application-owned manuscript snapshot, convert it locally with headless LibreOffice to DOCX/PDF and retain direct TypeScript MD/TXT serializers. Conversion does not replace the WRT/JSON source format. Bundling versus requiring a separately installed compatible LibreOffice must be decided; bundling adds a substantial platform-specific runtime to package/test, while separate installation introduces an export prerequisite and requires missing/incompatible-version feedback. Neither alternative is approved. Use a dedicated writable conversion profile and temporary output, preserve existing destination on failure, then publish through the approved export pipeline. Font/layout fidelity, startup/cancellation and installed targets require verification.

## Adopted selection

Jo answered “Bundle”: bundle LibreOffice for headless DOCX/PDF conversion; retain application-owned TypeScript MD/TXT serializers. Separate installation is not required. Prior candidate engines are superseded. See approved DEC-06 contract and TECH-12 for version/packaging/fonts/lifecycle/installed-output verification.
