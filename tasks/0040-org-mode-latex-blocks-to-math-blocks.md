# 0040: Convert Org-mode LaTeX Blocks to Fumadocs Math Blocks

## Overview

Implement conversion of org-mode `#+begin_latex` blocks to Fumadocs ` ```math ` blocks for proper mathematical rendering with KaTeX.

## Background

Org-mode supports LaTeX blocks for mathematical expressions, but these need to be converted to Fumadocs-compatible math blocks to ensure proper rendering with KaTeX.

## Implementation Details

### Changes Made

1. **Enhanced Org-mode Converter** (`src/lib/org-mode/converter.ts`):
   - Added extraction logic for `#+begin_latex` blocks before unified processing
   - Added restoration logic to convert LaTeX blocks to ` ```math ` code blocks
   - LaTeX content is preserved and wrapped in math code blocks

2. **Updated Shiki Configuration** (`source.config.ts`):
   - Added custom 'math' language definition for plain text highlighting
   - Prevents Shiki errors when processing math blocks
   - Math blocks are treated as plain text since they contain LaTeX markup

3. **Added KaTeX Stylesheet** (`src/app/layout.tsx`):
   - Imported KaTeX CSS for proper mathematical rendering
   - Ensures math expressions display correctly in Fumadocs

4. **Created Documentation** (`content/docs/org-mode/latex.org`):
   - Comprehensive example showing org-mode LaTeX block syntax
   - Demonstrates conversion to MDX math blocks
   - Includes rendered examples with KaTeX output

5. **Updated Demo File** (`content/docs/org-mode-demo.org`):
   - Added LaTeX block examples to the comprehensive demo
   - Updated feature checklist to include LaTeX blocks

6. **Added Test Coverage** (`src/lib/org-mode/converter.test.ts`):
   - Test case verifying LaTeX block conversion to math blocks

### Technical Details

- LaTeX blocks are extracted using regex: `/#+begin_latex\s*\n([\s\S]*?)#+end_latex/g`
- Content is stored with placeholders during processing
- Restored as: `\`\`\`math\n${content}\n\`\`\``
- Custom Shiki language prevents highlighting errors for math content

### Example Conversion

**Input (org-mode):**

```org
#+begin_latex
E = mc^2
#+end_latex
```

**Output (MDX):**

````
```math
E = mc^2
```
````

## Verification

- All existing tests pass (55/55)
- Build completes successfully
- LaTeX blocks render correctly with KaTeX in Fumadocs
- No Shiki language errors for math blocks

## Files Modified

- `src/lib/org-mode/converter.ts` - Added LaTeX block processing
- `source.config.ts` - Added math language definition
- `src/app/layout.tsx` - Added KaTeX CSS import
- `content/docs/org-mode/latex.org` - New documentation file
- `content/docs/org-mode-demo.org` - Updated with examples
- `src/lib/org-mode/converter.test.ts` - Added test case

## Status

✅ Completed - LaTeX blocks now convert to math blocks and render properly
