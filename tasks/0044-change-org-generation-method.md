# Change Org-Mode Generation Method

## Status: completed

## Motivation

The current approach uses a separate `.cache/docs/` directory to store generated .mdx files from .org sources. This creates complexity in managing two directories and merging content in Fumadocs configuration. By generating .org.mdx files directly alongside .org files in `content/docs/`, we simplify the build process and project structure.

## Benefits

- **Simplified Structure**: No need for separate cache directory, reducing complexity in source configuration
- **Easier Maintenance**: Generated files are colocated with source files, making relationships clearer
- **Git Integration**: Generated files are properly ignored, keeping repository clean
- **Direct Mapping**: .org files directly produce .org.mdx files with clear naming convention
- **Checksum Tracking**: MD5 sums ensure efficient rebuilds only when source changes

## Tasks

- [x] Change org-mode file generation to produce .org.mdx and .org.md5sum files instead of using .cache directory
- [x] Update converter logic to generate content/docs/a.org.mdx from content/docs/a.org
- [x] Implement MD5 checksum generation for content/docs/a.org.md5sum files
- [x] Update .gitignore to ignore _.org.mdx and _.org.md5sum files (scoped to content/ directory)
- [x] Remove existing .cache directory and related logic if no longer needed
- [x] Update any scripts or build processes that reference the old .cache method

## Summary

Successfully changed the org-mode file generation to produce .org.mdx and .org.md5sum files directly in content/docs/ instead of using .cache/docs/. Updated converter script, source configuration, and gitignore. Removed .cache directory. Build and prebuild scripts work correctly, with checksum-based incremental builds.
