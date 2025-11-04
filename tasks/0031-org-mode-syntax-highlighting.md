# 0031: Implement Org-mode Syntax Highlighting on Fumadocs

## Description

Add support for syntax highlighting of Org-mode code blocks in Fumadocs using Shiki.

## Requirements

- Define Org-mode language grammar for Shiki
- Configure Fumadocs to recognize and highlight Org-mode code blocks
- Ensure compatibility with existing Fumadocs setup

## Implementation Steps

- [x] Create Shiki language definition for Org-mode (`src/lib/shiki/org.ts`)
- [x] Export the language in `src/lib/shiki/languages.ts`
- [x] Configure Fumadocs MDX to include custom languages in `source.config.ts`
- [x] Update converter to handle Org-mode code blocks appropriately
- [x] Test syntax highlighting functionality

## Files Modified

- `src/lib/shiki/org.ts` - Org-mode language definition
- `src/lib/shiki/languages.ts` - Language exports
- `source.config.ts` - Fumadocs configuration
- `src/lib/org-mode/converter.ts` - Code block conversion
- `src/mdx-components.tsx` - Cleaned up components

## Testing

- Run `npm run test` to verify Shiki integration
- Build project with `npm run build` to ensure no errors
- Verify Org-mode code blocks are properly highlighted in Fumadocs

## Status

✅ Completed - Org-mode syntax highlighting is now fully supported in Fumadocs
