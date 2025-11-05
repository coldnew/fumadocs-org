# 0058-translate-org-drawer-to-fumadocs-accordion

## Goal

Convert Org-mode drawer blocks to Fumadocs accordion components in MDX output. Drawers are collapsible sections in Org-mode that can be mapped to accordion UI elements.

## Current State & Rationale

Org-mode drawers provide collapsible content sections, but when converted to MDX, they lose their interactive nature. Fumadocs provides accordion components that can restore this functionality, making the content more interactive and user-friendly.

## Implementation Plan

1. Research Org-mode drawer syntax and structure
2. Study Fumadocs accordion component API
3. Implement drawer detection and parsing in blocks system
4. Create accordion component generation
5. Handle nested drawers and content preservation
6. Add comprehensive tests for drawer conversion

## Tasks

- [x] Research Org-mode drawer syntax
- [x] Study Fumadocs accordion component
- [x] Implement drawer detection in blocks system
- [x] Create accordion MDX generation
- [x] Handle nested drawers
- [x] Add tests for drawer conversion

## Session Summary

Successfully implemented Org-mode drawer-to-accordion conversion with the following components:

### Files Created/Modified
- `src/lib/org-mode/blocks/drawer-blocks.ts` - Core drawer processing logic
- `src/lib/org-mode/blocks/drawer-blocks.test.ts` - Comprehensive test suite (12 tests)
- `src/lib/org-mode/blocks/index.ts` - Integration into blocks system

### Key Features Implemented
- Drawer detection using regex pattern `:([a-zA-Z][a-zA-Z0-9_]*):\s*\n([\s\S]*?)\s*:end:`
- Special drawer filtering (properties, logbook, clock, effort)
- Title case conversion for drawer names (e.g., `my_custom_drawer` → `My Custom Drawer`)
- Accordion JSX generation using Fumadocs components
- Content preservation including indentation
- Multiple drawer support
- Integration with existing blocks processing pipeline

### Technical Details
- Uses non-greedy regex matching for nested content handling
- Preserves original content indentation without trimming
- Generates unique IDs for accordion components
- Bidirectional support (process/restore functions)

### Test Coverage
- Basic drawer conversion
- Title case transformation
- Multiple drawers
- Special drawer skipping
- Mixed case names
- Indented content preservation
- Empty drawers
- Org markup in content
- Content outside drawers
- Nested content within drawers
- Accordion restoration (no-op)

All tests pass, linting and type checking successful. Ready for integration testing.