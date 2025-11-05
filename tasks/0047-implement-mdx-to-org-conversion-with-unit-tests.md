# Implement MDX to Org Mode Conversion with Unit Tests

## Overview

Implement bidirectional conversion between Org-mode and MDX to ensure compatibility and allow round-trip verification. MDX remains the first-class citizen, but provide a way to convert back to Org-mode for compatibility checks.

## Requirements

- Implement `convertMdxToOrg` function in `src/lib/org-mode/converter.ts`
- Support JSX syntax conversion to `#+begin_export jsx` blocks
- Handle frontmatter conversion to Org keywords
- Create comprehensive unit tests
- Implement round-trip tests (Org -> MDX -> Org)

## Implementation Steps

### Core Conversion Function

- [x] Add `convertMdxToOrg` function with signature: `(mdxContent: string, filename: string) => Promise<OrgConversionResult>`
- [x] Parse MDX using `remark-parse` with `remark-mdx` plugin
- [x] Extract frontmatter using `gray-matter` and convert to Org keywords format
- [x] Traverse AST and convert nodes to Org syntax

### MDX Element Conversions

- [x] Headings: `#` to `*` (depth-based)
- [x] Paragraphs: Standard paragraph handling
- [x] Lists: `-` items, handle nesting
- [x] Code blocks: `` ` to `#+begin_src lang ... #+end_src`
- [x] Inline code: `` `code` `` to `=code=`
- [x] Links: `[text](url)` to `[[url][text]]`
- [x] Bold: `**text**` to `*text*`
- [x] Italic: `*text*` to `/text/`
- [x] Tables: Markdown tables to Org tables
- [x] Blockquotes: `>` to indented text
- [x] Horizontal rules: `---` to `-----`
- [x] JSX elements: `<Component>` to `#+begin_export jsx ... #+end_export`

### JSX Handling

- [x] Detect `mdxJsxFlowElement` and `mdxJsxTextElement` nodes
- [x] Convert JSX attributes and children to string representation
- [x] Wrap in `#+begin_export jsx` blocks

### Frontmatter Handling

- [x] Extract YAML frontmatter from MDX
- [x] Convert key-value pairs to `# +KEY: value` format
- [x] Handle special keys like title, description, etc.

### Type Definitions

- [x] Add `OrgConversionResult` interface to `types.ts`
- [x] Update imports in `converter.ts`

### Unit Tests

- [x] Create `converter.test.ts` with MDX to Org test cases
- [x] Test basic markdown elements conversion
- [x] Test JSX conversion
- [x] Test frontmatter conversion
- [x] Test complex nested structures

### Round-trip Tests

- [x] Implement tests that convert Org -> MDX -> Org
- [x] Verify that the final Org is compatible with original
- [x] Handle edge cases and special syntax

### Dependencies

- [x] Verify `remark-mdx` is available (already installed via fumadocs-mdx)
- [x] Add any additional dependencies if needed

### Testing and Validation

- [x] Run `npm run test:run` to ensure all tests pass
- [x] Test with existing Org files to verify round-trip
- [x] Update any failing tests due to new functionality
- [x] Fix round-trip test input to use correct Org syntax
- [x] Add remark-gfm plugin for proper **bold** and _italic_ parsing
- [x] Implement dynamic table separator generation

### Documentation

- [x] Update function documentation in `converter.ts`
- [x] Add examples in comments for complex conversions
- [x] Update README or AGENTS.md if needed

### Manual Testing Script

- [x] Create `scripts/org2mdx.ts` for manual MDX to Org conversion testing
- [x] Add `npm run org2mdx` script to package.json
- [x] Update AGENTS.md with new command documentation
- [x] Test script with sample MDX files

## Acceptance Criteria

- [x] MDX to Org conversion works for all supported elements
- [x] JSX is properly converted to export blocks
- [x] Frontmatter is converted to Org keywords
- [x] Unit tests cover all conversion scenarios
- [x] Round-trip tests pass for existing Org files
- [x] No breaking changes to existing functionality
- [x] Code follows project conventions and passes linting
- [x] Manual testing script available for development
