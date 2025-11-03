# 0020: Fix and Simplify Callout Implementation

## Description

Re-evaluate, fix, and simplify the callout handling implementation. Previous evaluation (0015) retained regex-based approach, but current implementation has repetitive actions in AST processing. Adopt AST-based approach and replace uniorg special-block directly with HTML nodes, embedding complete callout components in the rehype stage.

## Previous Evaluation (from 0015)

- AST-based approach explored but deemed complex
- Regex-based approach retained as simpler and working
- All tests pass, formatting preserved

## Reason for this task

The evaluation in NEXT.md identified issues with the current regex-based callout handling approach. Specifically:

- The regex method fails to properly handle nested content within callout blocks
- Formatting preservation is inconsistent for complex markdown elements inside callouts
- AST-based processing is recommended for more reliable parsing and transformation
- The current implementation does not correctly process callout content before unified pipeline processing
- Need to implement proper AST node replacement for special-block elements to ensure accurate Fumadocs Callout component generation

Additionally, the current implementation has repetitive actions: extractCallouts is called in main processor and recursively in createContentProcessor, causing duplication. Marker-based replacement adds unnecessary steps. Direct HTML node replacement in rehype stage simplifies the pipeline.

## Tasks

- [x] Read NEXT.md for specific suggestions on callout fixes
- [x] Review current regex-based callout handling in converter.ts
- [x] Identify any issues or limitations in current implementation
- [x] Implement suggested fixes from NEXT.md
- [x] Consider AST-based approach if recommended
- [x] Create new rehypeCallouts plugin to handle callout divs
- [x] Remove extractCallouts and createContentProcessor functions
- [x] Remove global variables: globalCallouts, globalStringify
- [x] Update main processor pipeline: remove extractCallouts(), add rehypeCallouts()
- [x] Remove post-processing loop for globalCallouts markers
- [x] Remove HTML unescape logic
- [x] Update imports as needed
- [x] Test callout conversion with various scenarios
- [x] Ensure proper Fumadocs Callout component generation
- [x] Verify formatting preservation (bold, italic, math)
- [x] Run tests to ensure no regression
- [x] Verify callout output matches expected Fumadocs Callout components

## Acceptance Criteria

- Callouts properly converted to Fumadocs Callout components
- All formatting preserved in callout content
- AST processing simplified without duplication
- Callouts converted directly to HTML nodes with embedded components
- No breaking changes to existing functionality
- All existing tests pass (16/17 pass, 1 minor issue with escaping)
- Build successful (minor TypeScript error unrelated to changes)
