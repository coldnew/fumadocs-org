# 0055-refactor-org-mode-library

## Goal

Streamline the `src/lib/org-mode` library by removing legacy code, consolidating utility functions, and clarifying the module structure. This will improve maintainability and reduce technical debt.

## Current State & Rationale

The `converter.ts` file contains outdated and redundant conversion logic that has been superseded by the more robust implementations in `serialize.ts` (Org → MDX) and `deserialize.ts` (MDX → Org).

Additionally, `converter.ts` houses keyword-related utility functions (`extractOrgKeywords`, `getCalloutTypeFromOrgType`) that logically belong in `keywords.ts`. This duplication and misplacement create confusion for future development and make the codebase harder to maintain.

This refactoring will establish a single source of truth for conversion logic and centralize related utilities.

## Implementation Plan

1.  **Consolidate Keyword Logic**: Move the functions `extractOrgKeywords` and `getCalloutTypeFromOrgType` from `converter.ts` to `keywords.ts`.
2.  **Update Imports**: Adjust any files that were importing these functions from `converter.ts` to use `keywords.ts` instead.
3.  **Delete Legacy Code**: Remove the now-redundant `convertOrgToMdx` and `convertMdxToOrg` functions from `converter.ts`.
4.  **Remove Legacy Files**: Once empty, delete the `converter.ts` file and its corresponding test file, `converter.test.ts`.
5.  **Verification**: Run the full test suite to ensure that the refactoring did not introduce any regressions.

## Tasks

- [x] Consolidate keyword functions into `keywords.ts`
- [x] Update all imports to point to the new location in `keywords.ts`
- [x] Delete legacy conversion logic from `converter.ts`
- [x] Delete `converter.ts` and `converter.test.ts` files
- [x] Verify all unit tests pass after refactoring

## Session Summary

- **Analyzed `src/lib/org-mode`**: Identified `converter.ts` as a legacy module with redundant logic.
- **Consolidated Keyword Utilities**: Moved `extractOrgKeywords` and `getCalloutTypeFromOrgType` from `converter.ts` to `keywords.ts`.
- **Updated Imports**: Ensured `serialize.ts` correctly imports the moved functions from `keywords.ts`.
- **Removed Legacy Code**: Deleted the now-unused conversion logic from `converter.ts`.
- **Deleted Legacy Files**: Removed `converter.ts` and `converter.test.ts` from the project.
- **Verified Integrity**: Ran the entire test suite (127 tests) to confirm that the refactoring was successful and introduced no regressions.
- **Outcome**: The library is now cleaner, more maintainable, and free of confusing legacy code.
