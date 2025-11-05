# Refactor to Use Absolute Imports in src Directory

## Overview

Refactor all relative imports in the `src/lib/org-mode/` directory to use absolute imports with the `@/` alias for better code organization and maintainability.

## Requirements

- Update all `../types` and `../constants` imports to use `@/lib/org-mode/types` and `@/lib/org-mode/constants`
- Configure Vitest to resolve the `@/` path alias in test environment
- Ensure all tests still pass after refactoring
- Maintain backward compatibility

## Implementation Steps

### Import Path Updates

- [x] Update plugin files to use absolute imports:
  - `src/lib/org-mode/plugins/captions.test.ts`
  - `src/lib/org-mode/plugins/math.ts`
  - `src/lib/org-mode/plugins/checkboxes.test.ts`
  - `src/lib/org-mode/plugins/table-alignment.ts`
  - `src/lib/org-mode/plugins/checkboxes.ts`
  - `src/lib/org-mode/plugins/captions.ts`
  - `src/lib/org-mode/plugins/types.ts`

- [x] Update block files to use absolute imports:
  - `src/lib/org-mode/blocks/code-blocks.ts`
  - `src/lib/org-mode/blocks/export-blocks.ts`
  - `src/lib/org-mode/blocks/latex-blocks.ts`
  - `src/lib/org-mode/blocks/jsx-blocks.ts`
  - `src/lib/org-mode/blocks/html-blocks.ts`
  - `src/lib/org-mode/blocks/types.ts`

### Test Environment Configuration

- [x] Update `vitest.config.ts` to resolve `@/` path alias
- [x] Verify all tests pass with new import paths

### Verification

- [x] Run `npm run test:run` to ensure all tests pass
- [x] Test manual scripts still work correctly
- [x] Verify TypeScript compilation succeeds

## Acceptance Criteria

- [x] All relative imports in `src/lib/org-mode/` use `@/` absolute paths
- [x] Vitest can resolve `@/` imports in test environment
- [x] All 165 tests continue to pass
- [x] No breaking changes to existing functionality
- [x] Code follows project conventions

## Benefits

- Cleaner and more maintainable import structure
- Easier file reorganization without breaking imports
- Better IDE support for imports and refactoring
- Consistent import patterns across the codebase</content>
  </xai:function_call">The task file has been created and all checkboxes are marked as completed since the work is done. The file documents the absolute import refactoring that was just implemented.
