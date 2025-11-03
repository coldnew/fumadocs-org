# Task 0001: Basic Org-mode Support Integration

## Overview

Add basic Org-mode file support to the Fumadocs-based blog using uniorg for parsing and conversion to Markdown, allowing .org files to be processed through the existing MDX pipeline.

## Goals

- Enable writing documentation in Org-mode format
- Seamlessly integrate with existing Fumadocs MDX system
- Maintain all Org-mode features (headings, lists, code blocks, etc.)
- Minimal changes to core Fumadocs configuration

## Technical Approach

Use uniorg to parse .org files into AST, convert to Markdown, then let Fumadocs' MDX system handle rendering.

## Implementation Steps

### 1. Install Dependencies

```bash
npm install uniorg uniorg-parse uniorg-stringify-markdown
```

### 2. Create Custom Remark Plugin

Create `lib/org-remark-plugin.ts`:

- Check if file extension is .org
- Parse content with uniorg-parse into AST
- Convert AST to Markdown using uniorg-stringify-markdown
- Return Markdown string for MDX processing

### 3. Update source.config.ts

- Add custom remark plugin to mdxOptions.remarkPlugins
- Configure include patterns to support .org files
- Adjust fileExtensions if needed

### 4. Add Sample Content

Create `content/docs/sample.org` with basic Org-mode syntax:

- Headings (\*, **, \***)
- Lists (-, +, numbered)
- Code blocks (#+BEGIN_SRC)
- Links and formatting

### 5. Test Integration

- Run `npm run build` to verify compilation
- Run `npm run dev` to preview pages
- Check that Org-mode content renders correctly

### 6. Handle Edge Cases

- Frontmatter support in .org files
- Code syntax highlighting
- Image and link handling
- Routing for .org files

## Benefits

- Reuse existing MDX ecosystem
- Full Org-mode feature support via uniorg
- Minimal core modifications
- Future extensibility

## Status

- [ ] Dependencies installed
- [ ] Plugin created
- [ ] Config updated
- [ ] Sample content added
- [ ] Integration tested

## Notes

- Ensure uniorg packages are compatible with current Next.js version
- Test with complex Org-mode features (tables, drawers, etc.)
- Consider performance impact of conversion step
