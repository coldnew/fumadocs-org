# Task: Add Support for Org-mode #+JSX: Blocks

## Description

Add support for #+JSX: or #+jsx: single-line blocks in Org-mode files. Similar to #+HTML: blocks, but the content is already JSX syntax, so it can be directly output to MDX without transformation.

## Implementation Steps

- [x] Parse #+JSX: blocks in org-mode converter
- [x] Output the JSX content directly in MDX
- [x] Ensure proper handling and validation
- [x] Add tests for JSX block conversion
- [x] Create content/docs/org-mode/jsx.org as usage tutorial
