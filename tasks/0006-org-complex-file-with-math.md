# Task 0006: Create Complex Org-mode File with Math for Conversion Testing

## Overview

Create a comprehensive org-mode file with complex content including mathematical formulas, code blocks, tables, and various Org features to thoroughly test the conversion capabilities.

## Goals

- Test math formula conversion (LaTeX)
- Verify complex Org syntax handling
- Ensure all features work in generated MDX
- Validate Fumadocs rendering of complex content

## Implementation Steps

### 1. Create Complex Org File

Create `content/docs/math-sample.org` with:

- Mathematical formulas (inline and display)
- Code blocks in multiple languages
- Complex tables
- Links and references
- Lists with checkboxes
- Properties drawers
- Export settings

### 2. Test Conversion

- Run conversion script
- Check generated MDX for correctness
- Verify math rendering in Fumadocs

### 3. Handle Math Rendering

- Ensure LaTeX math is preserved in MDX
- Test with remark-math or rehype-katex if needed
- Verify math displays correctly in browser

### 4. Update Documentation

- Document supported Org features
- Note any limitations or workarounds

## Benefits

- Comprehensive testing of conversion pipeline
- Assurance of feature completeness
- Better understanding of capabilities and limitations

## Status

- [x] Create complex org file with math
- [x] Test conversion output
- [x] Verify math rendering in Fumadocs
- [x] Update documentation if needed

## Notes

- Focus on LaTeX math syntax: $inline$ and $$display$$
- Test various Org elements: drawers, timestamps, priorities
- Consider adding syntax highlighting for code blocks
