# 0056-add-time-parser-for-org-mode

## Goal

Add a time parser to the org-mode library that supports both org-mode standard timestamps and Hugo's time formats. This will enable proper date/time handling in org-to-MDX conversions, particularly for frontmatter and metadata extraction.

## Current State & Rationale

The project currently lacks dedicated time parsing capabilities. Org-mode files contain timestamps in formats like `<2023-10-01 Sun 14:30>` or `[2023-10-01 Sun 14:30]`, and Hugo uses ISO 8601 formats. Without a parser, date information cannot be reliably extracted and converted for use in MDX frontmatter or other date-sensitive operations.

## Time Format Specifications

### Org-mode Timestamps

Org-mode uses timestamp formats enclosed in angle brackets `<>` for active timestamps and square brackets `[]` for inactive ones. Key features:

- **Basic date**: `<2023-10-01 Sun>` or `[2023-10-01 Sun]`
- **With time**: `<2023-10-01 Sun 14:30>` or `[2023-10-01 Sun 14:30]`
- **Time ranges**: `<2023-10-01 Sun 14:30-16:00>`
- **Repeats**: `<2023-10-01 Sun 14:30 +1w>` (repeat weekly)
- **Delays**: `<2023-10-01 Sun 14:30 -2d>` (scheduled 2 days before)
- **Day names**: Optional weekday abbreviations (Mon, Tue, etc.)

### Hugo Time Formats

Hugo primarily uses ISO 8601 date/time formats:

- **Date only**: `2023-10-01`
- **Date and time**: `2023-10-01T14:30:00Z` (UTC)
- **With timezone**: `2023-10-01T14:30:00+08:00`
- **With seconds**: `2023-10-01T14:30:45Z`

### Key Differences

- **Enclosure**: Org-mode uses `<>` or `[]`, Hugo uses none
- **Day names**: Org-mode includes optional weekday, Hugo does not
- **Ranges/Repeats**: Org-mode supports time ranges and repeat intervals, Hugo does not
- **Timezone**: Both support, but Hugo uses standard ISO format
- **Separator**: Hugo uses 'T' between date and time, Org-mode uses space

The parser will need to handle these differences and convert to a standardized internal representation.

## Implementation Plan

1. Create a new `time.ts` module in `src/lib/org-mode/` with parsing functions
2. Define TypeScript interfaces for parsed timestamp objects
3. Implement regex-based parser for org-mode timestamp formats (active/inactive, with time ranges, repeats)
4. Add support for Hugo's time formats (ISO 8601)
5. Create comprehensive unit tests in `time.test.ts`
6. Integrate the parser into the conversion pipeline where dates are extracted (likely in serialize.ts for frontmatter)

## Tasks

- [x] Create `src/lib/org-mode/time.ts` with parser functions
- [x] Define timestamp interfaces and types
- [x] Implement org-mode timestamp parsing
- [x] Add Hugo time format parsing
- [x] Add org timestamp formatting for MDX -> org conversion
- [x] Write unit tests for all parsing scenarios
- [x] Integrate parser into org-to-MDX conversion pipeline
- [x] Integrate formatter into MDX-to-org conversion pipeline
- [x] Update exports in `src/lib/org-mode/index.ts`

## Session Summary

- **Created Time Parser Module**: Consolidated all time parsing functions into `src/lib/org-mode/time.ts` for both org-mode timestamps and Hugo ISO 8601 formats.
- **Defined TypeScript Interfaces**: Added `OrgTimestamp` and `ParsedTimestamp` interfaces to handle parsed date/time data with support for ranges, repeats, and delays.
- **Implemented Regex-Based Parsing**: Developed robust regex patterns to parse org-mode timestamp formats including active/inactive brackets, optional day names, time ranges, repeats (+Nd), and delays (-Nd).
- **Added Hugo Format Support**: Integrated ISO 8601 parsing using native JavaScript Date constructor with validation.
- **Added Org Timestamp Formatting**: Implemented `formatAsOrgTimestamp` to convert Date objects back to org-mode timestamp strings for MDX-to-org deserialization.
- **Comprehensive Unit Tests**: Created 20 test cases covering all parsing and formatting scenarios, edge cases, and format validations.
- **Integrated into Conversion Pipelines**: Modified `serialize.ts` to parse DATE keywords from org-mode to ISO for MDX frontmatter, and `deserialize.ts` to format dates as org timestamps for MDX-to-org conversion.
- **Updated Exports**: Added time parsing and formatting functions and types to the library's public API in `index.ts`.
- **Verified Functionality**: All 147 existing tests pass, ensuring no regressions were introduced.
