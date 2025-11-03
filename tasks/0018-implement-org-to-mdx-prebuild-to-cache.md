# 0018: Implement .org to .mdx Prebuild to .cache Directory

## Status: completed

## Description

Restore prebuild functionality to convert .org files to .mdx and store generated files in .cache/docs/ directory, while copying manual .mdx files from content/docs/ to maintain unified content directory for Fumadocs.

## Goals

- Restore `npm run prebuild` script for .org conversion
- Generate .mdx files from .org files in `.cache/docs/` directory
- Copy manual .mdx files from `content/docs/` to `.cache/docs/`
- Ensure Fumadocs reads from single `.cache/docs/` directory
- Maintain clean separation between source and generated content

## Implementation Plan

### 1. Restore Prebuild Script

- Add back `prebuild` script to `package.json`
- Modify `scripts/convert-org.ts` to output to `.cache/docs/`
- Ensure proper directory structure preservation

### 2. Manual File Copying

- Add logic to copy existing .mdx files from `content/docs/` to `.cache/docs/`
- Handle file conflicts (generated files should not overwrite manual files)
- Maintain directory structure for nested files

### 3. Update Fumadocs Configuration

- Change `source.config.ts` back to read from `.cache/docs/`
- Ensure proper MDX processing and component resolution
- Verify build and development workflows

### 4. Cache Management

- Implement cache validation for generated .mdx files
- Add cache cleaning functionality
- Ensure proper file timestamps and dependencies

## Current Directory Structure

```
content/docs/
├── index.mdx          # Manual MDX (copy to .cache)
├── test.mdx           # Manual MDX (copy to .cache)
├── complex-math.org   # Source (convert to .cache)
├── math-sample.org    # Source (convert to .cache)
└── sample.org         # Source (convert to .cache)

.cache/docs/
├── index.mdx           # Copied from content/docs/
├── test.mdx            # Copied from content/docs/
├── complex-math.mdx    # Generated from complex-math.org
├── math-sample.mdx     # Generated from math-sample.org
└── sample.mdx          # Generated from sample.org
```

## Expected Behavior

- `npm run prebuild` converts .org files and copies .mdx files to `.cache/docs/`
- Fumadocs reads from `.cache/docs/` with all content available
- Manual .mdx files take precedence over any generated conflicts
- Development workflow includes prebuild step

## Files to Modify

- `package.json` - Add prebuild script
- `scripts/convert-org.ts` - Modify output directory and add file copying
- `source.config.ts` - Change back to read from `.cache/docs/`
- Ensure proper cache directory management

## Testing

- Verify prebuild generates correct .mdx files in .cache/docs/
- Confirm manual .mdx files are copied correctly
- Test Fumadocs indexing from .cache/docs/
- Ensure build and development workflows work
- Validate .org to .mdx conversion with math support
