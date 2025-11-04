# 0032: Document Current Code Block Handling Approach and Implementation

## Description

Document the current approach and implementation details for handling Org-mode code blocks, including the recent fix for nested code block parsing using reference counting logic.

## Current Code Block Handling Architecture

### Overview

The Org-mode converter handles code blocks through a multi-stage process:

1. **Preprocessing**: Replace code blocks with markers before unified pipeline processing
2. **Unified Pipeline**: Process Org AST through rehype/remark transformations
3. **Postprocessing**: Restore code blocks from markers with appropriate markdown formatting

### Key Components

#### 1. Code Block Replacement (`replaceCodeBlocks`)

- **Location**: `src/lib/org-mode/converter.ts:404-452`
- **Purpose**: Replace Org code blocks with markers to avoid interference with unified pipeline
- **Algorithm**:
  - Use iterative parsing with reference counting (nesting level tracking)
  - Find each `#+begin_src` and locate matching `#+end_src` using `findMatchingEnd`
  - Replace entire blocks with `CODEBLOCKMARKER{n}` placeholders
  - Handle nested blocks correctly by maintaining nesting counters

#### 2. Reference Counting Logic (`findMatchingEnd`)

- **Location**: `src/lib/org-mode/converter.ts:348-373`
- **Purpose**: Correctly match nested `#+begin_src`/`#+end_src` pairs
- **Algorithm**:
  - Start with nesting level = 1
  - Increment counter for each `#+begin_src` found
  - Decrement counter for each `#+end_src` found
  - Return when nesting level reaches 0

#### 3. Code Block Restoration (`restoreCodeBlock`)

- **Location**: `src/lib/org-mode/converter.ts:524-570`
- **Purpose**: Convert stored code blocks back to markdown format
- **Special Handling**:
  - `text` blocks: Extract content and wrap in ````text` code blocks
  - `org` blocks: Extract content and wrap in ````text` code blocks (preserve inner Org syntax)
  - Other language blocks: Convert to appropriate markdown code blocks with syntax highlighting

### Nested Code Block Handling

#### Problem Solved

Previous implementation used non-greedy regex `/#\+begin_src(?:\s+(\w+))?\s*\n([\s\S]*?)#\+end_src/g` which incorrectly matched first `#+begin_src` to first `#+end_src`, breaking nested structures.

#### Solution Implemented

- Replaced regex with proper parser using reference counting
- Maintains correct nesting levels for arbitrarily deep nesting
- Special handling for `org` blocks to preserve inner Org syntax

#### Example Handling

```
#+begin_src org
#+begin_src javascript
function example() { return true; }
#+end_src
#+end_src
```

Becomes:

```text
#+begin_src javascript
function example() { return true; }
#+end_src
```

### Design Decisions

#### 1. Marker-Based Processing

- **Why**: Unified pipeline can interfere with Org syntax processing
- **Benefit**: Clean separation of concerns between AST processing and code block handling

#### 2. Reference Counting vs Regex

- **Why**: Regex cannot handle arbitrary nesting levels correctly
- **Benefit**: Robust handling of complex nested structures

#### 3. Special Org Block Handling

- **Why**: Org blocks containing code examples should preserve syntax for documentation
- **Benefit**: Maintains readability of Org-mode documentation

### Files Involved

- `src/lib/org-mode/converter.ts` - Main implementation
- `src/lib/org-mode/converter.test.ts` - Comprehensive test coverage
- `tasks/0031-org-mode-syntax-highlighting.md` - Related syntax highlighting work

### Testing Coverage

- Basic code block conversion
- Nested code blocks within text blocks
- Nested code blocks within org blocks
- Multiple code blocks in same document
- Code blocks with/without language specification
- Special characters and multi-line content

### Future Considerations

#### Potential Improvements

- Performance optimization for large documents with many code blocks
- Support for additional Org block types beyond `src`
- Enhanced error handling for malformed code blocks
- Integration with syntax highlighting themes

#### Maintenance Notes

- Reference counting logic is critical for correctness
- Test coverage should be maintained for any changes
- Changes to marker format require coordinated updates

## Status

✅ Completed - Current code block handling approach is documented and implemented

## Related Tasks

- 0031: Org-mode syntax highlighting implementation
- Future: Performance optimization and additional block type support
