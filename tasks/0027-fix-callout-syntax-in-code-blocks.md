# Fix Callout Syntax Conversion in Code Blocks

## Description

The Org-mode syntax inside `#+begin_src text ... #+end_src` blocks is being incorrectly converted to `<Callout>` components instead of preserving the original syntax for demonstration purposes.

## Problem

In files like `callouts.org`, the syntax example code block contains org-mode callout syntax, but the converter processes it as actual callouts, replacing `#+begin_warning` with `<Callout type="warning">` in the generated MDX.

## Expected Behavior

Code blocks should preserve the original Org-mode syntax for educational purposes, not convert it.

## Tasks

- [x] Modify the converter to skip callout processing inside code blocks
- [x] Test that syntax examples remain as raw Org-mode syntax
- [x] Ensure demonstrations still convert callouts properly
- [x] Regenerate and verify all affected files

## Implementation Details

- Added logic to temporarily replace code blocks with markers before callout processing
- Restored code blocks after conversion to preserve original syntax
- Verified that syntax examples show raw Org-mode syntax while demonstrations convert properly
