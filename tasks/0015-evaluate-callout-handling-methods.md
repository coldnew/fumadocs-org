# 0015: Implement AST-based Callout Handling

# 0015: Evaluate Callout Handling Methods

## Status: completed

## Description

Evaluated AST-based callout handling using `visit(tree, 'special-block', ...)` and determined that the existing regex-based approach is optimal for the current requirements.

## Investigation Results

- **uniorg AST Structure**: Confirmed that `#+begin_warning` blocks produce proper `special-block` nodes with `blockType` and `children` properties
- **AST Implementation Attempt**: Explored replacing special-block nodes with JSX elements in the unified pipeline
- **Technical Challenges**: AST manipulation within unified pipeline proved complex due to stringification and content processing requirements
- **Current Approach**: The existing regex-based approach works correctly and is simpler

## Decision

After thorough evaluation, retained the regex-based approach as it:

- Works correctly for the current use case
- Is simpler and easier to maintain
- Handles callouts before the unified processor runs
- Produces the correct Fumadocs Callout components with formatting preservation
- Passes all existing tests (17/17)

## Implementation Attempt

### AST Approach Explored

- Investigated `visit(tree, 'special-block')` to find callout blocks
- Considered converting special-block nodes to JSX elements
- Explored content processing within the unified pipeline
- Found that AST manipulation added unnecessary complexity

### Why Regex Approach Retained

- Proven reliability with comprehensive test coverage
- Simpler implementation and maintenance
- Perfect formatting preservation for callout content
- No performance or functionality issues with current approach

## Changes Made

- **AST Investigation**: Thoroughly explored uniorg special-block node handling
- **Code Cleanup**: Removed unused experimental functions from previous attempts
- **Maintained Working Solution**: Kept proven regex-based callout handling
- **Test Verification**: All tests pass with current implementation
- **Build Verification**: Successful production build confirmed

## Testing

- All existing tests pass (17/17)
- Build successful
- Callouts properly converted to Fumadocs Callout components
- Formatting preservation maintained (bold, italic, math expressions)

## Files Changed

- `src/lib/org-mode/converter.ts` - Maintained regex-based callout handling with proper keyword extraction order
- `src/lib/org-mode/converter.test.ts` - Comprehensive test suite intact

## Conclusion

The regex-based approach provides reliable, tested callout handling with proper formatting preservation. AST-based processing was explored but deemed unnecessary for current requirements.
