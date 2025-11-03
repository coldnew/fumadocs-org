# 0021: Abandon Task 20 Callout Implementation

## Description

Evaluate and abandon the implementation from task 0020 due to increased complexity, failing unit tests, and additional processing steps. Revert to a simpler placeholder-based approach that avoids processing intermediate content within callout blocks.

## Reasons for Abandoning Task 20

Based on evaluation after implementation:

1. **Increased Conversion Complexity**: The AST-based approach in task 20 adds a new `rehypeCallouts` plugin that processes subtree content separately, making the conversion pipeline more complex than necessary.

2. **Unit Tests Failing**: After task 20 implementation, unit tests do not all pass. Specifically, the test "should preserve formatting inside callouts" fails because bold and italic formatting gets escaped (e.g., `**bold**` becomes `\*\*bold\*\*` inside the Callout component).

3. **Additional Processing Steps**: Task 20 introduces multiple conversion processes:
   - Extract callout content as subtree
   - Convert subtree to MDAST
   - Stringify back to markdown
   - Attempt to unescape markers
   - Embed into raw HTML

4. **Content Processing Issues**: Unlike the original approach, task 20 requires extracting and separately processing the intermediate content within callout blocks, which leads to formatting preservation problems.

## Original Approach Analysis

The original method (before task 20) was to:

- Use regex to identify callout blocks
- Replace them with placeholders (e.g., `CALLOUTMARKER0`) that MDX won't process
- Complete the full MDX conversion
- Then replace placeholders with `<Callout>` components without needing to process the intermediate content

This approach:

- Avoids processing content inside callouts during conversion
- Maintains formatting integrity
- Keeps the pipeline simpler
- Passes all unit tests

## User's Judgment Assessment

The user's assessment is correct:

- The conversion has become more complex
- Unit tests cannot all pass
- Additional processing steps have been added
- The original placeholder approach avoids processing intermediate content, which task 20 does not

## Tasks

- [x] Revert changes from task 0020
- [x] Restore the original regex-based placeholder approach for callout handling
- [x] Ensure all unit tests pass
- [x] Verify formatting preservation inside callouts
- [x] Simplify the conversion pipeline by removing unnecessary AST processing for callouts

## Acceptance Criteria

- All unit tests pass (17/17)
- Callout formatting (bold, italic, math) is preserved
- Conversion pipeline is simplified without AST subtree processing for callouts
- No regression in other functionality
