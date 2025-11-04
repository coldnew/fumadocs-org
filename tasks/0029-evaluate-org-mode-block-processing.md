# 0029: Evaluate if all org-mode blocks can use the codeblock processing mechanism

## Overview

Following the recent simplification of codeblock processing using a two-phase mechanism (first handle text blocks precisely, then other codeblocks recursively), evaluate whether other org-mode block types can benefit from similar processing.

## Tasks

- [x] Identify all org-mode block types from org-syntax documentation
- [x] Analyze how each block type is currently handled in converter.ts
- [x] Determine which blocks need special processing (preserve content vs process content)
- [x] Evaluate if blocks needing preservation can use the two-phase codeblock mechanism
- [x] Propose implementation changes for applicable blocks
- [x] Implement handling for example and comment blocks

## Context

Current codeblock mechanism:

1. Replace blocks with markers before unified processing
2. Restore as markdown after processing

This preserves content that shouldn't be processed as org syntax.

## Expected Outcome

Determine which additional block types should use similar marker-based processing to avoid unwanted org syntax processing in their content.

## Implementation

- **Example blocks**: Use marker-based processing to preserve literal content, restored as markdown code blocks without language
- **Comment blocks**: Removed entirely from output
- **Other blocks** (quote, center, verse): Continue using unified pipeline for content processing
- **Export blocks**: Not implemented yet, may need backend-specific handling
