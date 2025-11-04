# Task: Add Support for Org-mode #+begin_export jsx Blocks

## Description

Add support for multi-line #+begin_export jsx blocks in Org-mode files. The content is JSX syntax and will be added directly to the MDX file without transformation.

## Dependencies

- Depends on task 0035 (single-line JSX support)

## Implementation Steps

- [x] Extend parser to handle #+begin_export jsx blocks
- [x] Output JSX content directly in MDX
- [x] Preserve block structure
- [x] Add tests for multi-line JSX export blocks
- [x] Update documentation with multi-line JSX examples
