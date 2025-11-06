# Split src/lib/org-mode to packages/org2mdx

## Overview
Refactor the org-mode conversion library from `src/lib/org-mode/` into a standalone package at `packages/org2mdx/` to improve project structure and enable better package management.

## Requirements
- [x] Create `packages/org2mdx/` directory structure
- [x] Move all files from `src/lib/org-mode/` to `packages/org2mdx/`
- [x] Create `package.json` for the new org2mdx package with proper dependencies
- [x] Update all internal import statements to use relative paths
- [x] Update external imports in scripts and documentation to reference new package path
- [x] Update TypeScript and build configurations to recognize the new package location
- [x] Verify that all tests pass and build completes successfully

## Implementation Details

### Package Structure
```
packages/org2mdx/
├── index.ts                    # Main exports
├── serialize.ts               # Org → MDX conversion
├── deserialize.ts             # MDX → Org conversion
├── types.ts                   # TypeScript type definitions
├── constants.ts               # Library constants and patterns
├── keywords.ts                # Org keyword extraction and processing
├── time.ts                    # Time parsing utilities
├── utils.ts                   # General utility functions
├── blocks/                    # Block processing modules
│   ├── index.ts
│   ├── types.ts
│   ├── code-blocks.ts
│   ├── latex-blocks.ts
│   ├── html-blocks.ts
│   ├── jsx-blocks.ts
│   ├── export-blocks.ts
│   └── drawer-blocks.ts
├── plugins/                   # Unified plugins
│   ├── index.ts
│   ├── types.ts
│   ├── captions.ts
│   ├── checkboxes.ts
│   ├── table-alignment.ts
│   └── math.ts
└── package.json               # Package configuration
```

### Dependencies Added
The new package.json includes all required dependencies:
- `gray-matter`: Frontmatter parsing
- `html-to-jsx-transform`: HTML to JSX conversion
- `rehype-remark`: HTML to Markdown conversion
- `remark-gfm`: GitHub Flavored Markdown support
- `remark-mdx`: MDX remark support
- `remark-parse`: Markdown parsing
- `remark-stringify`: Markdown serialization
- `uniorg`: Org-mode parsing
- `uniorg-parse`: Org AST parsing
- `uniorg-rehype`: Org to HTML conversion
- `unified`: Unified processor
- `unist-util-visit`: AST traversal utility

### Import Updates
- **Internal imports**: Changed from `@/lib/org-mode/*` to relative paths (`./types`, `../blocks`, etc.)
- **External imports**: Updated scripts and documentation to import from `@/packages/org2mdx`
- **Test files**: Updated to use relative imports within the package

### Configuration Updates
- **tsconfig.json**: Added `"@/packages/*": ["./packages/*"]` path mapping
- **vitest.config.ts**: Added `'@/packages': path.resolve(__dirname, './packages')` alias
- **AGENTS.md**: Updated documentation to reference new package location

### Files Modified
- `packages/org2mdx/package.json` (created)
- `tsconfig.json` (updated path mappings)
- `vitest.config.ts` (updated aliases)
- `AGENTS.md` (updated documentation)
- `scripts/org2mdx.ts` (updated import path)
- `scripts/mdx2org.ts` (updated import path)
- All files in `packages/org2mdx/` (updated internal imports)

## Verification
- ✅ TypeScript compilation passes (`npx tsc --noEmit`)
- ✅ All tests pass (167 tests across 13 test files)
- ✅ Build completes successfully (`npm run build`)
- ✅ Org-to-MDX conversion pipeline works correctly
- ✅ MDX-to-Org conversion pipeline works correctly

## Benefits
1. **Better Package Management**: The org2mdx library is now a proper standalone package
2. **Clear Separation**: Library code is separated from application code
3. **Dependency Isolation**: Package dependencies are explicitly declared
4. **Reusability**: The package can potentially be used in other projects
5. **Maintainability**: Clearer project structure and dependency management

## Migration Notes
- All existing functionality is preserved
- API remains unchanged - `convertOrgToMdx` and `convertMdxToOrg` functions work identically
- Build scripts and workflows continue to function normally
- No breaking changes for consumers of the library

## Session Summary
- Successfully moved all org-mode library files from `src/lib/org-mode/` to `packages/org2mdx/`
- Created standalone package with proper `package.json` including all dependencies
- Updated all import statements: internal to relative paths, external to `@/packages/org2mdx`
- Modified TypeScript and Vitest configurations to support new package location
- Updated documentation in AGENTS.md
- Verified functionality: TypeScript compilation passes, all 167 tests pass, build completes successfully
- Org-to-MDX and MDX-to-Org conversion pipelines working correctly
- No breaking changes introduced, all existing functionality preserved</content>
</xai:function_call/>
<xai:function_call name="list">
<parameter name="path">tasks