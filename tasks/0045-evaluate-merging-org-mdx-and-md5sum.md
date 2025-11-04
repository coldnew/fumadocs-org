# Evaluate Merging .org.mdx and .org.md5sum Files

## Status: completed

## Description

Evaluated merging checksum information directly into .org.mdx files instead of maintaining separate .org.md5sum files. Implemented prototype using JSX comment embedding.

## Decision

**Proceed with merged approach**: Embed checksums in .org.mdx files as JSX comments.

## Performance Results

- **Separate checksums**: Skip time ~0.499s for 14 files
- **Embedded checksums**: Skip time ~0.512s for 14 files
- **Performance impact**: ~2.6% slower, negligible for current scale
- **Regeneration time**: ~0.849s (when all files need rebuild)

## Benefits Achieved

- **Reduced file count**: Eliminated 14 separate .md5sum files
- **Simpler gitignore**: Only need to ignore .org.mdx files
- **Colocated metadata**: Checksum lives with generated content
- **Cleaner structure**: No scattered checksum files

## Implementation

- Checksum embedded as: `{/* checksum: <md5> */}` in generation comment
- Extraction via regex: `/checksum:\s*([a-f0-9]{32})/`
- Automatic cleanup of old .md5sum files during prebuild
- Updated .gitignore to remove .org.md5sum patterns

## Performance Summary

**Current Performance Difference:**

- **Separate checksum files**: ~0.499s for skip checks (14 files)
- **Embedded checksums**: ~0.512s for skip checks (14 files)
- **Impact**: ~2.6% slower (~0.013s difference)

**File Sizes**: .org.mdx files range from 889B to 4.4KB (very small)

**Analysis**: The difference is negligible for current scale. Reading entire small files is not a bottleneck.

**Potential Speedup Ideas:**

1. **Partial file reading**: Read only first 500 bytes since checksum is in header comment
2. **Line-by-line parsing**: Stop reading after finding checksum
3. **Memory caching**: Cache extracted checksums within a single prebuild run (though unnecessary for current use case)

**Recommendation**: No optimization needed currently. The embedded approach provides better maintainability with minimal performance cost. If .org files grow significantly larger in the future, implement partial reading optimization.

## Tasks

- [x] Analyze current prebuild performance with separate checksum files
- [x] Implement prototype with embedded checksums
- [x] Benchmark performance difference
- [x] Evaluate file size and management implications
- [x] Decide whether to proceed with merge or keep separate files
