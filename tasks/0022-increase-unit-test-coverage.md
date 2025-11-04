# 0022: Increase Unit Test Coverage

## Description

Improve unit test coverage for the codebase by setting up coverage reporting, analyzing current coverage levels, and adding additional tests to cover more code paths, especially for critical functions in the org-mode converter.

## Tasks

- [x] Install @vitest/coverage-v8 dependency
- [x] Configure Vitest for coverage reporting in vitest.config.ts
- [x] Run coverage analysis to identify uncovered code
- [x] Add unit tests for uncovered functions and edge cases in converter.ts
- [x] Add tests for error handling and invalid inputs
- [x] Add tests for complex org-mode features (tables, lists, links, etc.)
- [x] Add tests for plugins with low coverage (captions.ts)
- [x] Ensure coverage reaches at least 80% for critical functions
- [x] Verify all new tests pass

## Status: completed

## Acceptance Criteria

- Coverage reporting is set up and working
- Unit test coverage increased to at least 80% for src/lib/org-mode/
- All existing tests still pass
- New tests cover edge cases and error conditions
- No regression in functionality
