# 0016: Implement MDX Caching Mechanism

## Status: completed

## Description

Implement a caching mechanism for Org-mode to MDX conversion to avoid placing generated .mdx files in the same directory as .org source files. This prevents git indexing issues and improves build performance.

## Goals

- Move generated .mdx files from `content/docs/` to `.cache/docs/` maintaining directory structure
- Implement MD5 checksum validation to determine when .org files need re-conversion
- Create `.cache/docs/filename.mdx.md5sum` files to track source file changes
- Only re-convert .org files when their MD5 checksum differs from cached version

## Implementation Plan

### 1. Create Cache Directory Structure

- Create `.cache` directory at project root
- Mirror the `content/docs/` directory structure in `.cache/docs/`
- Ensure `.cache` is in `.gitignore`

### 2. Implement MD5 Checksum System

- Create utility function to calculate MD5 checksum of .org files
- Create function to read/write checksum files
- Compare current checksum with cached checksum

### 3. Update Conversion Script

- Modify `scripts/convert-org.ts` to use cache directory
- Add checksum validation before conversion
- Update file paths to point to cache directory
- Handle directory creation automatically

### 4. Update Build Process

- Modify `package.json` prebuild script if needed
- Ensure Next.js can find .mdx files in cache directory
- Update any references to content directory

### 5. Cleanup Legacy MDX Files

- Remove .mdx files from content/docs/ that have corresponding .org files
- Preserve .mdx files without .org counterparts (like index.mdx)
- Ensure clean transition to cache-based system

### 6. Add Cache Management

- Add script to clear cache if needed
- Add cache validation on build
- Handle cache directory cleanup

## Expected Benefits

- Cleaner git repository (no generated files tracked)
- Faster builds (only re-convert changed files)
- Better separation of source and generated content
- Improved development workflow

## File Structure

```
project/
├── content/
│   └── docs/
│       ├── sample.org
│       └── math-sample.org
├── .cache/
│   └── docs/
│       ├── sample.mdx
│       ├── sample.mdx.md5sum
│       ├── math-sample.mdx
│       └── math-sample.mdx.md5sum
└── scripts/
    └── convert-org.ts (modified)
```

## Technical Details

- Use Node.js crypto module for MD5 calculation
- Maintain relative directory structure in cache
- Checksum files use `.mdx.md5sum` extension
- Cache directory should be gitignored

## Files Modified

- `scripts/convert-org.ts` - Added caching logic with MD5 checksum validation
- `source.config.ts` - Changed docs directory from `content/docs` to `.cache/docs`
- `.gitignore` - Added `.cache` directory to ignore list
- `tasks/0016-implement-mdx-caching-mechanism.md` - Task documentation

## Implementation Details

### MD5 Checksum System

- Uses Node.js `crypto.createHash('md5')` for checksum calculation
- Checksum files stored as `.mdx.md5sum` alongside cached MDX files
- Only re-converts when source MD5 differs from cached checksum

### Cache Directory Structure

```
.cache/
└── docs/
    ├── sample.mdx
    ├── sample.mdx.md5sum
    ├── math-sample.mdx
    └── math-sample.mdx.md5sum
```

### Conversion Logic

1. Calculate current MD5 of .org file
2. Compare with cached checksum
3. Skip conversion if checksums match
4. Convert and cache if checksums differ
5. Save new checksum after successful conversion

### Legacy File Cleanup

- Removed .mdx files from content/docs/ that have corresponding .org files:
  - complex-math.mdx
  - math-sample.mdx
  - sample.mdx
- Preserved .mdx files without .org counterparts:
  - index.mdx
  - test.mdx

## Testing Results

- ✅ Cache directory created with correct structure
- ✅ MD5 checksum validation working (skips unchanged files)
- ✅ Change detection working (re-converts modified files)
- ✅ Next.js build successful with cache directory
- ✅ Legacy .mdx files properly cleaned up
- ✅ All existing functionality preserved</content>
  </xai:function_call">Create task file for implementing MDX caching mechanism
