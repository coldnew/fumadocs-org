# Task 0002: Add Generated Comment to Org-mode Converted MDX Files

## Overview
Add a comment at the top of .mdx files generated from Org-mode sources to indicate they are auto-generated and should not be edited directly.

## Goals
- Prevent accidental editing of generated .mdx files
- Clearly mark files as converted from Org-mode
- Maintain separation between source (.org) and output (.mdx) files

## Implementation Steps

### 1. Update Conversion Script
Create or modify a conversion script that:
- Reads .org files from content/docs/
- Extracts TITLE from #+TITLE: keyword for accurate frontmatter
- Converts them to .mdx using uniorg pipeline
- Adds a MDX comment header to generated .mdx files

### 2. Comment Format
Add after frontmatter in generated .mdx files:
```jsx
{/* This file is auto-generated from [source.org]. Do not edit directly. */}
```

### 3. Integration with Build Process
- Add prebuild script to convert .org to .mdx
- Ensure comments are added during conversion
- Update package.json scripts if needed

### 4. Update Existing Sample
Modify content/docs/sample.mdx to include the generated comment and correct title

### 5. Documentation
Update README or docs to explain the Org-mode workflow

## Benefits
- Prevents confusion about which files to edit
- Maintains source (.org) as the single source of truth
- Clear separation between generated and authored content

## Status
- [x] Create conversion script
- [x] Add comment header logic
- [x] Update sample.mdx
- [x] Integrate with build process
- [x] Test conversion workflow

## Notes
- Consider using frontmatter instead of HTML comment for better MDX compatibility
- Ensure comment doesn't interfere with Fumadocs parsing