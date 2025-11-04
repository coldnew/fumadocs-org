# Plan: Add Support for Org-mode #+begin_export jsx Blocks

## Description

Similar to plan 0003, add support for multi-line #+begin_export jsx blocks in Org-mode files. The content is JSX syntax and will be added directly to the MDX file without transformation.

## Dependencies

- Depends on plan 0003 (single-line JSX support)

## Implementation Steps

- Extend parser to handle #+begin_export jsx blocks
- Output JSX content directly in MDX
- Preserve block structure
- Add tests for multi-line JSX export blocks
