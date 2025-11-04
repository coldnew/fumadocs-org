# 0030: Review callout processing and improve unit tests

## Overview

Review the current callout processing mechanism in comparison to the recently implemented codeblock processing. Evaluate if unification or improvements are needed, and update unit tests to use exact matching.

## Tasks

- [x] Review current callout processing mechanism and compare with codeblock implementation
- [x] Evaluate if callout processing can be unified or improved
- [x] Update callout unit tests to use exact string matching instead of contains

## Context

- Codeblock mechanism: Extract with markers → No processing → Restore as markdown
- Callout mechanism: Extract with markers → Process content through unified → Restore as JSX components
- Current tests use `toContain` which allows partial matches; should use exact matches for better validation

## Conclusion

- Callout processing is already well-structured and similar to codeblocks (extract-process-restore pattern)
- No modifications needed for unification
- Unit tests updated to use exact string matching for better validation
