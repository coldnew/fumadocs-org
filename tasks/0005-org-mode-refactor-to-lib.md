# Task 0005: Refactor Org-mode Conversion to Dedicated Library

## Overview

Refactor org-mode conversion logic into a dedicated module at `src/lib/org-mode/` for better organization and reusability.

## Goals

- Create a dedicated org-mode processing library
- Separate conversion logic from build scripts
- Improve code maintainability and testing
- Enable reuse in other parts of the application

## Implementation Steps

### 1. Create org-mode Library Structure

Create `src/lib/org-mode/` directory with:

- `index.ts` - Main exports
- `converter.ts` - Core conversion logic
- `types.ts` - TypeScript type definitions
- `utils.ts` - Utility functions

### 2. Extract Conversion Logic

Move conversion functions from `scripts/convert-org.mjs` to library:

- Keyword extraction
- Frontmatter generation
- MDX conversion pipeline

### 3. Update Build Script

Modify `scripts/convert-org.mjs` to use the new library:

- Import from `@/lib/org-mode`
- Simplify script to file processing loop
- Keep file I/O operations in script

### 4. Add TypeScript Types

Define proper types for:

- Org keywords
- Conversion options
- Generated frontmatter

### 5. Test Refactored Code

- Ensure conversion still works correctly
- Verify build process unchanged
- Test with existing sample files

## Benefits

- Better code organization
- Easier testing and maintenance
- Potential for reuse in dev server or other features
- Clear separation of concerns

## Status

- [x] Create org-mode library structure
- [x] Extract conversion logic to library
- [x] Update build script to use library
- [x] Add TypeScript types
- [x] Test refactored implementation

## Notes

- Maintain backward compatibility
- Keep file processing in scripts for build pipeline
- Consider async/await for better error handling
