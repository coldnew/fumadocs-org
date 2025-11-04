# Task: Remove Unused org-remark-plugin.ts

## Description

The `org-remark-plugin.ts` file is no longer in use. The current implementation uses a prebuild script approach instead of a remark plugin for org-mode conversion. Remove the unused file and its export from the index.

## Dependencies

- None

## Implementation Steps

- [x] Verify the plugin is not used anywhere in the codebase
- [x] Remove the export from `src/lib/org-mode/index.ts`
- [x] Delete the `src/lib/org-mode/org-remark-plugin.ts` file
- [x] Run tests to ensure nothing breaks
- [x] Update any task files that reference the plugin
