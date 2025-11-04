# 0041: Refactor Org-mode Library Architecture

## Overview

Refactor the `src/lib/org-mode` directory to improve maintainability, type safety, and testability. The current implementation has grown unwieldy with a monolithic converter file, global state issues, and code duplication.

## Why Refactor?

### Current Issues

1. **Code Duplication**
   - `extractOrgKeywords` function exists in both `utils.ts` and `converter.ts`
   - Inconsistent implementations between the two versions

2. **Monolithic Architecture**
   - `converter.ts` is 830+ lines handling multiple responsibilities
   - Single file manages parsing, transformation, block processing, and plugin logic
   - Difficult to navigate and maintain

3. **Global State Problems**
   - Uses global variables (`globalTableAlignments`, `globalCaptions`) for plugin communication
   - Not thread-safe or suitable for testing
   - Side effects between different processing phases

4. **Type Safety Issues**
   - Extensive use of `any` types throughout the codebase
   - Missing proper TypeScript interfaces for AST nodes
   - Weak typing in plugin functions and utilities

5. **Magic Strings & Constants**
   - Hardcoded marker strings: `CODEBLOCKMARKER`, `EXAMPLEBLOCKMARKER`, `LATEXMARKER`, etc.
   - Regex patterns scattered throughout code
   - No centralized constants management

6. **Mixed Concerns**
   - Block processing logic (code, latex, html, jsx) mixed with conversion pipeline
   - Plugin definitions scattered throughout the main converter
   - Utility functions not properly organized

7. **Testing Challenges**
   - Global state makes unit testing difficult
   - Large functions are hard to test in isolation
   - Complex interdependencies between components

## Goals

- **Modular Architecture**: Break down monolithic converter into focused, single-responsibility modules
- **Type Safety**: Eliminate `any` types and provide proper TypeScript interfaces
- **Testability**: Remove global state and enable proper unit testing
- **Maintainability**: Improve code organization and reduce complexity
- **Extensibility**: Create plugin system for easy addition of new features
- **Performance**: Better memory management and reduced side effects

## Proposed Architecture

```
src/lib/org-mode/
├── index.ts                    # Main exports
├── types.ts                    # Type definitions (enhanced)
├── constants.ts               # Magic strings, regex patterns
├── utils.ts                   # Pure utility functions
├── keywords.ts               # Keyword extraction logic
├── plugins/                   # Plugin system
│   ├── index.ts
│   ├── captions.ts
│   ├── checkboxes.ts
│   ├── table-alignment.ts
│   ├── math.ts
│   └── types.ts
├── blocks/                    # Block processing
│   ├── index.ts
│   ├── code-blocks.ts
│   ├── latex-blocks.ts
│   ├── html-blocks.ts
│   ├── jsx-blocks.ts
│   └── types.ts
├── converter.ts              # Main conversion pipeline (simplified)
└── converter.test.ts         # Tests (updated)
```

## Implementation Plan

### Phase 1: Foundation (High Priority)

- [ ] Create `constants.ts` with all magic strings and regex patterns
- [ ] Create `keywords.ts` and consolidate `extractOrgKeywords` function
- [ ] Enhance `types.ts` with proper AST node interfaces
- [ ] Update `utils.ts` to remove duplicated functions

### Phase 2: Plugin System (High Priority)

- [ ] Create `plugins/` directory structure
- [ ] Extract plugin functions from converter:
  - [ ] `orgCaptions()` → `plugins/captions.ts`
  - [ ] `orgCheckboxes()` → `plugins/checkboxes.ts`
  - [ ] `orgTableAlignment()` → `plugins/table-alignment.ts`
  - [ ] `rehypeCaptionsAndTableAlignment()` → `plugins/math.ts`
- [ ] Replace global variables with context objects
- [ ] Create plugin types and interfaces

### Phase 3: Block Processing (Medium Priority)

- [ ] Create `blocks/` directory structure
- [ ] Extract block processing logic:
  - [ ] Code block handling → `blocks/code-blocks.ts`
  - [ ] LaTeX block handling → `blocks/latex-blocks.ts`
  - [ ] HTML block handling → `blocks/html-blocks.ts`
  - [ ] JSX block handling → `blocks/jsx-blocks.ts`
  - [ ] Export block handling → `blocks/export-blocks.ts`
- [ ] Create block processing types and interfaces

### Phase 4: Converter Simplification (Medium Priority)

- [ ] Simplify `converter.ts` to use new modular components
- [ ] Remove global variables and side effects
- [ ] Improve error handling and logging
- [ ] Add proper TypeScript types throughout

### Phase 5: Testing & Validation (High Priority)

- [ ] Update all tests to work with new architecture
- [ ] Add unit tests for individual plugins and blocks
- [ ] Ensure backward compatibility
- [ ] Performance testing and optimization

## Success Criteria

- ✅ All existing tests pass
- ✅ No breaking changes to public API
- ✅ Improved type safety (no `any` types in core logic)
- ✅ Modular architecture with clear separation of concerns
- ✅ Enhanced testability and maintainability
- ✅ Better performance and memory usage
- ✅ Comprehensive documentation

## Risk Mitigation

- **Incremental Approach**: Each phase can be implemented and tested independently
- **Backward Compatibility**: Public API remains unchanged during refactoring
- **Comprehensive Testing**: Full test suite ensures functionality preservation
- **Code Reviews**: Each phase reviewed before proceeding to next

## Files to be Modified/Created

### New Files

- `src/lib/org-mode/constants.ts`
- `src/lib/org-mode/keywords.ts`
- `src/lib/org-mode/plugins/index.ts`
- `src/lib/org-mode/plugins/captions.ts`
- `src/lib/org-mode/plugins/checkboxes.ts`
- `src/lib/org-mode/plugins/table-alignment.ts`
- `src/lib/org-mode/plugins/math.ts`
- `src/lib/org-mode/plugins/types.ts`
- `src/lib/org-mode/blocks/index.ts`
- `src/lib/org-mode/blocks/code-blocks.ts`
- `src/lib/org-mode/blocks/latex-blocks.ts`
- `src/lib/org-mode/blocks/html-blocks.ts`
- `src/lib/org-mode/blocks/jsx-blocks.ts`
- `src/lib/org-mode/blocks/types.ts`

### Modified Files

- `src/lib/org-mode/types.ts` (enhanced)
- `src/lib/org-mode/utils.ts` (simplified)
- `src/lib/org-mode/converter.ts` (simplified)
- `src/lib/org-mode/converter.test.ts` (updated)
- `src/lib/org-mode/index.ts` (updated exports)

## Timeline Estimate

- **Phase 1**: 2-3 hours
- **Phase 2**: 4-5 hours
- **Phase 3**: 3-4 hours
- **Phase 4**: 2-3 hours
- **Phase 5**: 2-3 hours
- **Total**: 13-18 hours

## Benefits

- **Maintainability**: Smaller, focused modules are easier to understand and modify
- **Testability**: Isolated functions and plugins can be unit tested independently
- **Type Safety**: Better TypeScript support reduces runtime errors
- **Extensibility**: Plugin system makes adding new features easier
- **Performance**: Reduced global state and better memory management
- **Developer Experience**: Cleaner code structure and better documentation</content>
  </xai:function_call">Create task file for org-mode library refactoring
  </xai:function_call">Create task file for org-mode library refactoring
  </xai:function_call">Create task file for org-mode library refactoring
  </xai:function_call">Create task file for org-mode library refactoring
  </xai:function_call">Create task file for org-mode library refactoring
  </xai:function_call">Create task file for org-mode library refactoring
  </xai:function_call name="todowrite">
  <parameter name="todos">[{"content":"Create constants.ts with all magic strings and regex patterns","status":"pending","priority":"high","id":"create-constants-module"},{"content":"Create keywords.ts and consolidate extractOrgKeywords function","status":"pending","priority":"high","id":"consolidate-keywords"},{"content":"Enhance types.ts with proper AST node interfaces","status":"pending","priority":"high","id":"enhance-types"},{"content":"Create plugins/ directory and extract plugin functions from converter","status":"pending","priority":"high","id":"create-plugin-system"},{"content":"Create blocks/ directory and extract block processing logic","status":"pending","priority":"medium","id":"create-block-system"},{"content":"Simplify converter.ts to use new modular components","status":"pending","priority":"medium","id":"simplify-converter"},{"content":"Update all tests to work with new architecture","status":"pending","priority":"high","id":"update-tests"},{"content":"Ensure backward compatibility and run full test suite","status":"pending","priority":"high","id":"validate-compatibility"}]
