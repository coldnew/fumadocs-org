# Simplify Org-mode Codeblock Processing

## Description

The current org-mode codeblock processing is overly complex with recursive marker replacement and nested handling. Since actual nested codeblocks are rare in org-mode files, we can simplify the processing to directly convert `#+begin_src ... #+end_src` blocks to MDX codeblocks without recursion.

## Problem

Current implementation uses:

- Recursive `replaceCodeBlocks` function
- Complex marker restoration in `restoreCodeBlock`
- Unnecessary complexity for handling nested blocks that rarely occur

## Solution

Implement a simplified approach:

1. Single-pass regex replacement of all `#+begin_src ... #+end_src` blocks
2. Direct conversion to MDX format without considering nesting
3. Remove recursive logic and complex restoration

## Tasks

- [x] Modify `convertOrgToMdx` in `converter.ts` to use simplified codeblock handling
- [x] Remove `replaceCodeBlocks` recursive function
- [x] Simplify `restoreCodeBlock` function
- [x] Update regex to handle codeblocks without language specification
- [x] Add comprehensive unit tests for edge cases with precise assertions:
  - Multiple codeblocks in same document (exact markdown output matching)
  - Codeblocks without language (exact markdown output matching)
  - Codeblocks with special characters and multiline content (exact markdown output matching)
- [x] Verify all existing functionality still works
- [x] Implement proper text block handling to preserve inner org syntax
- [x] Add test for text blocks with nested org syntax (preserved as-is)
- [x] Run full test suite to ensure no regressions (33/33 tests passing)

## Benefits

- Simpler, more maintainable code
- Better performance (no recursion)
- Easier to understand and debug
- Sufficient for real-world org-mode usage patterns
