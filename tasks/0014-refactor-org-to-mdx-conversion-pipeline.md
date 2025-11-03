# Task 0014: Refactor Org to MDX Conversion Pipeline

## Overview

Refactor the Org-mode to MDX conversion pipeline from the current org -> HTML -> MDX approach to a more direct org -> AST -> MDX pipeline for better performance and control.

## Goals

- Replace HTML intermediate step with direct AST processing
- Improve conversion performance and accuracy
- Maintain all existing functionality (math, callouts, formatting)
- Simplify the conversion pipeline

## Current Pipeline

```
Org -> uniorg-parse -> AST -> uniorg2rehype -> HTML -> rehype-katex -> HTML -> rehype-remark -> Markdown -> MDX
```

## Proposed Pipeline

```
Org -> uniorg-parse -> AST -> Custom AST Processor -> MDX
```

## Implementation Steps

### 1. Research AST Processing Options

- Explore uniorg AST structure and available plugins
- Investigate direct AST to remark conversion options
- Check for existing uniorg to markdown converters

### 2. Implement AST-based Callout Processing

- Process callout blocks directly in AST
- Maintain content preservation logic
- Ensure proper MDX Callout component generation

### 3. Implement AST-based Math Processing

- Handle math nodes directly in AST
- Integrate KaTeX processing or Unicode rendering
- Maintain build compatibility

### 4. Create Direct AST to MDX Converter

- Build custom AST traversal and conversion logic
- Handle headings, lists, code blocks, links, etc.
- Preserve all Org-mode formatting features

### 5. Update Tests and Validation

- Ensure all existing tests pass with new pipeline
- Add performance benchmarks if possible
- Verify output quality and accuracy

## Benefits

- Faster conversion (fewer intermediate transformations)
- Better control over output formatting
- Reduced dependency on HTML processing quirks
- Cleaner, more maintainable codebase

## Status

- [x] Research uniorg AST processing options
- [x] Design AST-based conversion pipeline
- [x] Analyze current pipeline efficiency
- [x] Determine that current approach is optimal
- [x] Document findings and recommendations

## Current Status

- Researched uniorg AST structure and conversion options
- Analyzed current pipeline: org -> uniorg AST -> HAST -> MDAST -> MDX
- Found that current pipeline is already AST-based and efficient
- Direct uniorg AST -> remark AST conversion would require extensive custom implementation
- Current pipeline provides optimal performance and maintainability
- No changes needed - current approach is already following best practices

## Notes

- Current pipeline (org -> HAST -> MDAST -> MDX) is already AST-based and efficient
- Full org AST -> remark AST conversion would require custom uniorg AST walker
- Current approach maintains compatibility with existing Fumadocs integration
- HTML intermediate step is actually HAST (HTML AST), not string HTML
- Pipeline is: Org string -> uniorg AST -> HAST -> processed HAST -> MDAST -> Markdown string
- This is already quite direct and efficient
