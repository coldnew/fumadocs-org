# Task 0003: Convert Org-mode Frontmatter to YAML in Generated MDX

## Overview

Extract all Org-mode frontmatter keywords (like TITLE, AUTHOR, DATE, etc.) and convert them to YAML format in the generated MDX files' frontmatter section.

## Goals

- Preserve all Org-mode metadata in the generated MDX
- Convert Org keyword format to YAML frontmatter
- Ensure Fumadocs can properly parse the YAML frontmatter
- Maintain compatibility with existing MDX frontmatter handling

## Implementation Steps

### 1. Extract All Org Keywords

Modify the conversion script to extract all `#+KEYWORD: value` lines from Org files:

- TITLE, AUTHOR, DATE, EMAIL, etc.
- Custom keywords defined in the Org file

### 2. Convert to YAML Frontmatter

- Transform extracted keywords to YAML key-value pairs
- Handle special characters and formatting
- Merge with existing generated frontmatter (title, description)

### 3. Update MDX Generation

- Include all extracted keywords in the YAML frontmatter
- Ensure proper YAML formatting
- Maintain backward compatibility

### 4. Handle Special Cases

- Keywords with multiple lines
- Keywords with special characters
- Default values for missing keywords

### 5. Test and Validate

- Verify YAML frontmatter is valid
- Test with various Org files containing different keywords
- Ensure Fumadocs processes the frontmatter correctly

## Benefits

- Full preservation of Org-mode metadata
- Seamless integration with Fumadocs frontmatter system
- Enhanced document metadata handling

## Status

- [x] Update conversion script to extract all keywords
- [x] Implement YAML conversion logic
- [x] Test with sample Org file containing multiple keywords
- [x] Validate Fumadocs frontmatter parsing
- [ ] Update documentation

## Notes

- Use a YAML library for proper formatting
- Consider keyword normalization (e.g., TITLE -> title)
- Ensure compatibility with Fumadocs' frontmatter schema
