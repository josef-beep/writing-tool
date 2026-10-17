# Candidate contrast checks

Engineering reference consulted 2026-10-17: [W3C text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) describes 4.5:1 normal text and 3:1 large text; [non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) describes applicable 3:1 component/graphic distinctions. Candidate colors will be checked for specified foreground/background pairs using relative luminance, without rounding a failing ratio into a pass. This is a design check, not complete WCAG conformance or runtime/platform verification.
