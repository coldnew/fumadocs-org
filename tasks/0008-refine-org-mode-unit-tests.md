# Task 0008: Refine Org-mode Unit Tests

## Overview
Refine and expand the unit tests for Org-mode conversion to ensure comprehensive coverage of all supported blocks and elements.

## Goals
- Analyze all Org-mode elements in the test file
- Identify gaps in current test coverage
- Add unit tests for missing elements (tables, links, TODO keywords)
- Ensure all tests pass and provide good coverage

## Implementation Steps

### 1. Analyze Org-mode Elements
- Review `content/docs/math-sample.org` for all elements
- Identify supported vs unsupported features
- Document current test coverage gaps

### 2. Review Existing Tests
- Examine `src/lib/org-mode/converter.test.ts`
- Verify what elements are already tested
- Note any failing or incomplete tests

### 3. Add Missing Unit Tests
- Add tests for tables (adjusted for actual output format)
- Add tests for links (external links)
- Add tests for TODO keywords
- Skip unsupported features (checkboxes, properties, drawers, export options)

### 4. Run and Verify Tests
- Execute test suite to ensure all tests pass
- Verify test coverage meets requirements
- Ensure CI integration works

### 5. Update Documentation
- Update AGENTS.md if needed
- Complete task documentation

## Benefits
- Improved test coverage for Org-mode conversion
- Better reliability and confidence in code changes
- Documentation of supported Org-mode features
- Prevention of regressions in conversion logic

## Status
- [x] Analyze Org-mode elements in math-sample.org
- [x] Review current converter.test.ts for coverage
- [x] Add unit tests for tables, links, and TODO keywords
- [x] Run tests and verify all pass (9 tests total)
- [x] Update task documentation

## Completed
- Analyzed math-sample.org containing: headings, math, code blocks, tables, lists, checkboxes, properties, drawers, links, export settings, footnotes, special chars, TODO keywords
- Reviewed existing tests covering: basic content, keywords, headings, lists, code blocks
- Added tests for: tables (with correct spacing), links, TODO keywords
- Skipped unsupported features: checkboxes (not converted), properties (not extracted), drawers (ignored), export options (filtered out)
- All 9 tests now pass successfully
- CI workflow will run tests on every push/PR

## Notes
- Tables preserve Org-mode spacing in Markdown output
- Links convert properly from [[url][text]] to [text](url)
- TODO keywords are preserved in headings
- Some Org features (checkboxes, properties, drawers) are not supported by the current uniorg library
- Export options (OPTIONS, LATEX_HEADER) are intentionally filtered out to avoid issues