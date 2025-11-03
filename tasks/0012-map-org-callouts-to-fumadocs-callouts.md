# Task 0012: Map Org Callouts to Fumadocs Callouts

## Overview

Implement mapping from Org-mode callout blocks (#+begin_warning, #+begin_note, etc.) to Fumadocs Callout components for better visual presentation.

## Goals

- Convert Org-mode callout blocks to Fumadocs Callout MDX components
- Support common callout types: warning, note, tip, info, success, error
- Maintain content formatting within callouts
- Ensure proper rendering in Fumadocs UI

## Implementation Steps

### 1. Research Callout Syntax

- Review Fumadocs Callout component API and supported types
- Identify Org-mode callout block syntax patterns
- Map Org callout types to Fumadocs types

### 2. Implement Conversion Logic

- Add callout detection and conversion in converter.ts
- Handle block parsing and content extraction
- Generate appropriate MDX Callout syntax

### 3. Add Test Cases

- Create unit tests for various callout types
- Test nested content and formatting preservation
- Verify edge cases and error handling

### 4. Update Documentation

- Document supported callout mappings
- Update task completion status

## Supported Callout Types

| Org-mode Block  | Fumadocs Type | Description           |
| --------------- | ------------- | --------------------- |
| #+begin_warning | warning       | Warning messages      |
| #+begin_note    | info          | Informational notes   |
| #+begin_tip     | success       | Tips and hints        |
| #+begin_info    | info          | General information   |
| #+begin_success | success       | Success confirmations |
| #+begin_error   | error         | Error messages        |

## Benefits

- Enhanced visual presentation of important content
- Consistent callout styling across documentation
- Better user experience with color-coded information blocks

## Status

- [x] Research Fumadocs Callout API and Org-mode syntax
- [x] Implement callout conversion logic in converter
- [x] Add comprehensive unit tests
- [x] Test rendering in Fumadocs UI
- [x] Update documentation

## Completed

- Researched Fumadocs Callout component with types: warning, info, success, error
- Implemented Org-mode callout block detection and conversion in converter.ts
- Added regex-based parsing for #+begin_xxx / #+end_xxx blocks
- Created mapping: warning→warning, note→info, tip→success, info→info, success→success, error→error
- Added pre-processing to extract callout content and replace with markers
- Added post-processing to process callout content separately and restore as <Callout> MDX components
- Added unescaping logic to prevent remark-stringify from escaping HTML tags
- Added comprehensive unit test covering all supported callout types
- Tested conversion with real Org content containing callouts
- All callout tests pass
- Callout functionality is fully implemented and working

## Notes

- Callouts are converted to MDX <Callout type="..."> components
- Content within callouts maintains original formatting (bold, math, etc.)
- Unsupported callout types are not converted (remain as regular content)
- Implementation handles multi-line content within callout blocks
- Math processing may need further refinement for complex LaTeX expressions
