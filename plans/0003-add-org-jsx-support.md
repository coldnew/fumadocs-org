# Plan: Add Support for Org-mode #+JSX: Blocks

## Description

Add support for #+JSX: or #+jsx: single-line blocks in Org-mode files. Similar to #+HTML: blocks, but the content is already JSX syntax, so it can be directly output to MDX without transformation.

## Implementation Steps

- Parse #+JSX: blocks in org-mode converter
- Output the JSX content directly in MDX
- Ensure proper handling and validation
- Add tests for JSX block conversion
