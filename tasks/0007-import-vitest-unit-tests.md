# Task 0007: Import Vitest for Unit Testing

## Overview

Set up Vitest as the testing framework for unit tests, with test files colocated next to source files (e.g., converter.ts and converter.test.ts).

## Goals

- Install and configure Vitest
- Write unit tests for core functions
- Establish testing conventions
- Update AGENTS.md with testing guidelines

## Implementation Steps

### 1. Install Vitest

```bash
npm install --save-dev vitest @vitest/ui
```

### 2. Configure Vitest

- Create `vitest.config.ts` with TypeScript support
- Configure test environment for Node.js
- Set up test file patterns

### 3. Update package.json

- Add test scripts: `test`, `test:ui`, `test:run`
- Configure for TypeScript and ESM

### 4. Write Unit Tests

- Create `src/lib/org-mode/converter.test.ts`
- Test `convertOrgToMdx` function with various inputs
- Test keyword extraction and frontmatter generation

### 5. Update AGENTS.md

Add Testing section with:

- Testing framework: Vitest
- Test file naming: `*.test.ts`
- Test structure conventions
- Running tests commands

### 6. Run Tests

- Execute test suite
- Verify test coverage
- Ensure CI integration

## Benefits

- Reliable testing of conversion logic
- Faster development with TDD
- Better code quality assurance
- Standardized testing practices

## Status

- [x] Install Vitest
- [x] Configure Vitest
- [x] Update package.json
- [x] Write unit tests
- [x] Update AGENTS.md
- [x] Run and verify tests
- [x] Ensure CI integration

## Completed

- Installed Vitest and @vitest/ui
- Created `vitest.config.ts` with TypeScript and test environment configuration
- Added test scripts to `package.json`: `test`, `test:ui`, `test:run`
- Wrote comprehensive unit tests for `convertOrgToMdx` function in `src/lib/org-mode/converter.test.ts`
- Updated `AGENTS.md` with Testing section including framework, scripts, and conventions
- All tests pass successfully
- Created GitHub Actions CI workflow for automated testing

## Notes

- Ordered lists in Org-mode are currently converted as unordered lists due to uniorg library limitations
- Test coverage focuses on core conversion functionality
- CI runs lint, type check, tests, and build on every push/PR

## Notes

- Use Vitest's built-in TypeScript support
- Test files should be colocated with source files
- Focus on testing pure functions first
