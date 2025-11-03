# Fix Prebuild Script to Clean Up Orphaned MDX Files

## Description

The `npm run prebuild` script does not clean up MDX files in `.cache/docs/` that correspond to Org files no longer present in `content/docs/`. This can lead to stale cached files.

## Tasks

- [x] Modify `scripts/convert-org.ts` to remove orphaned .mdx files before conversion
- [x] Test the prebuild script to ensure cleanup works correctly

## Implementation Details

- Added logic to scan existing .mdx files in `.cache/docs/`
- For each .mdx file, check if corresponding .org exists in `content/docs/`
- If not, delete the .mdx file
- Verified by creating a test orphaned file and confirming it gets removed
