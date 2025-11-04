# Plan: Convert Org-mode #+begin_export html to MDX JSX

## Description

After implementing plan 0001, handle multi-line #+begin_export html blocks in Org-mode files. Convert the HTML content inside these blocks to React-compatible JSX for MDX output.

## Dependencies

- Depends on plan 0001 (HTML to JSX conversion library selection)

## Implementation Steps

- Extend the org-mode converter to handle #+begin_export html blocks
- Apply the same HTML-to-JSX transformation used in plan 0001
- Preserve block structure while converting content
- Ensure JSX output is valid for MDX
