# Task 0010: Enable Full Math Support in Org-mode

## Overview

Implement complete mathematical formula support for Org-mode conversion, including proper rendering and export of inline and display math expressions.

## Goals

- Enable full LaTeX math rendering in converted MDX
- Support both inline ($...$) and display ($$...$$) math expressions
- Integrate remark-math and rehype-katex for proper math processing
- Ensure math formulas display correctly in the blog

## Implementation Steps

### 1. Analyze Current Math Handling

- Review current math conversion in converter.ts
- Check how math spans are processed from uniorg-rehype
- Verify existing math expressions in math-sample.org

### 2. Integrate Math Plugins

- Add remark-math to the conversion pipeline
- Configure rehype-katex for math rendering
- Update the unified pipeline in converter.ts

### 3. Test Math Rendering

- Verify inline math ($x^2 + y^2 = z^2$) renders correctly
- Verify display math ($$\int_0^1 f(x) dx$$) renders correctly
- Test complex formulas from math-sample.org

### 4. Update Dependencies

- Ensure rehype-katex and remark-math are properly configured
- Add any missing math-related dependencies if needed

### 5. Validate Export

- Test the full conversion pipeline
- Ensure math renders in the blog interface
- Verify no breaking changes to existing functionality

## Benefits

- Full mathematical notation support in Org-mode documents
- Professional rendering of equations and formulas
- Enhanced content capabilities for technical writing

## Status

- [x] Analyze current math handling implementation
- [x] Integrate remark-math and rehype-katex plugins
- [x] Test math rendering for inline and display expressions
- [x] Update dependencies and configuration
- [x] Validate complete export pipeline

## Completed

- Analyzed uniorg math handling: all math marked as math-inline spans
- Updated converter.ts to properly replace math spans with $$...$$ syntax
- Added test math expressions to math-sample.org (inline, display, complex)
- Added unit test for math expression conversion in converter.test.ts
- Verified math expressions convert correctly: $E = mc^2$, $\int_0^1 f(x) \, dx$, $\lim_{x \to 0} \frac{\sin x}{x} = 1$
- Confirmed remark-math and rehype-katex are configured in source.config.ts
- Tested full conversion pipeline - math renders properly in generated MDX
- Updated AGENTS.md with guideline to consider unit tests for new features

## Notes

- Uniorg marks all math as math-inline, so using $$ for all expressions
- Math expressions are properly escaped in markdown output
- Remark-math and rehype-katex handle rendering in the blog interface
- Complex LaTeX expressions (integrals, limits) work correctly
