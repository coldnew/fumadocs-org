# Evaluate Moving Checksum to Frontmatter

## Description

Consider moving the embedded checksum from the JSX comment after frontmatter to inside the frontmatter itself, either as a YAML comment or in a structured way.

## Current Format

```
---
title: Complex Org-mode Features Test 1
author: Test Author
description: 'Testing complex Org-mode features including math, code, and tables'
---

{/* This file is auto-generated from org-mode-demo.org. Do not edit directly. checksum: a0b6a68009987f8122035f21fe0d3262 */}
```

## Proposed Format

```
---
# checksum: a0b6a68009987f8122035f21fe0d3262
title: Complex Org-mode Features Test 1
author: Test Author
description: 'Testing complex Org-mode features including math, code, and tables'
---

{/* This file is auto-generated from org-mode-demo.org. Do not edit directly. */}
```

Or with JSX comment in frontmatter (if supported):

```
---
# {/* checksum: a0b6a68009987f8122035f21fe0d3262 */}
title: Complex Org-mode Features Test 1
author: Test Author
description: 'Testing complex Org-mode features including math, code, and tables'
---

{/* This file is auto-generated from org-mode-demo.org. Do not edit directly. */}
```

## Benefits

- **Cleaner separation**: Build metadata (checksum) separated from content metadata (title, author, etc.)
- **Single metadata block**: All file-level information in frontmatter
- **Easier parsing**: Checksum extraction could be simpler if in structured format
- **Better organization**: Frontmatter contains all non-content information

## Considerations

- **YAML compatibility**: Ensure frontmatter remains valid YAML
- **MDX processing**: Verify Fumadocs/Next.js handles comments in frontmatter correctly
- **Extraction logic**: Update getEmbeddedChecksum to parse frontmatter
- **Backward compatibility**: Consider migration path

## Implementation Options

1. **YAML comment**: `# checksum: <md5>`
2. **YAML key**: `checksum: <md5>` (but this adds it to document data)
3. **JSX in YAML**: `# {/* checksum: <md5> */}` (if supported)
4. **Separate frontmatter section**: Add checksum field but mark as build-only

## Status: completed

## Decision

**Proceed with frontmatter approach**: Place checksum as YAML comment in frontmatter.

## Implementation

- Checksum embedded as: `# checksum: <md5>` in frontmatter
- Handles cases where frontmatter doesn't exist (creates minimal frontmatter)
- Extraction via same regex (works for both locations)
- Generation comment simplified (no checksum)

## Performance Summary

**Performance Comparison:**

- **JSX comment checksums**: ~0.512s for skip checks (14 files)
- **Frontmatter checksums**: ~0.515s for skip checks (14 files)
- **Impact**: ~0.6% slower (~0.003s difference) - negligible

**File Sizes**: .org.mdx files range from 889B to 4.4KB

**Analysis**: Performance impact minimal. Frontmatter approach provides cleaner organization.

## Benefits Achieved

- **Better organization**: Build metadata separated from content
- **YAML compliance**: Checksum as proper YAML comment
- **Cleaner structure**: Frontmatter contains all file-level metadata
- **Backward compatibility**: Same extraction logic works

## Tasks

- [x] Test YAML comment compatibility with MDX processing
- [x] Implement prototype with checksum in frontmatter
- [x] Discard frontmatter not exist workaround (frontmatter always exists)
- [x] Add test cases for checksum extraction (4 test cases in scripts/convert-org.test.ts)
- [x] Update extraction logic for frontmatter parsing
- [x] Measure performance change after implementation
- [x] Verify build and Fumadocs compatibility
- [x] Evaluate readability and maintenance benefits
