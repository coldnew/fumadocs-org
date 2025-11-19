# Add Missing fumadocs-mdx Config Exports to fumadocs-org

## Task Overview

Add missing `frontmatterSchema` and `metaSchema` exports to `fumadocs-org/config` as aliases of the corresponding exports from `fumadocs-mdx/config`. Additionally, ensure all other missing exports from fumadocs-mdx are available as aliases in fumadocs-org.

## Background

The `fumadocs-org` package should provide a complete API that includes all the configuration utilities from `fumadocs-mdx`, since users of fumadocs-org may need access to schemas and configuration functions without having to install both packages.

## Implementation Details

### 1. Config Directory Structure

- **Created**: `packages/fumadocs-org/src/config/index.ts`
- **Purpose**: Re-export all fumadocs-mdx/config exports as aliases

### 2. Complete Export List

All exports from `fumadocs-mdx/config` are now available as aliases:

#### Schema Exports
- `frontmatterSchema` - Zod schema for document frontmatter
- `metaSchema` - Zod schema for meta files

#### Configuration Functions
- `defineCollections` - Define collection schemas
- `defineConfig` - Define global configuration  
- `defineDocs` - Define documentation collections
- `getDefaultMDXOptions` - Get default MDX processing options
- `remarkInclude` - Remark plugin for file includes

#### Type Exports
- `type AnyCollection` - Generic collection type
- `type BaseCollection` - Base collection interface
- `type CollectionSchema` - Collection schema type
- `type DefaultMDXOptions` - Default MDX options type
- `type DocCollection` - Document collection type
- `type DocsCollection` - Documentation collection type
- `type GlobalConfig` - Global configuration type
- `type MetaCollection` - Meta collection type
- `type PostprocessOptions` - Post-processing options type

### 3. Package Configuration

#### Package Exports
Added config export to `package.json`:

```json
{
  "exports": {
    "./config": {
      "types": "./dist/config/index.d.ts",
      "import": "./dist/config/index.mjs", 
      "require": "./dist/config/index.js"
    }
  }
}
```

#### Build Configuration
Updated `tsup.config.ts` to include config entry:

```typescript
export default defineConfig({
  entry: [
    'src/index.ts',
    'src/core/index.ts',
    'src/plugin.ts',
    'src/next/index.ts',
    'src/loaders/org.ts',
    'src/runtime/next/index.ts',
    'src/config/index.ts',  // Added
    'src/bin.ts',
  ],
  // ... rest of config
});
```

#### Main Index Exports
Updated `src/index.ts` to export config functions alongside core exports:

```typescript
// Main entry point for fumadocs-org package
export * from './core';
export * from './next';

// Export config schemas and utilities that don't conflict with core exports
export {
  frontmatterSchema,
  metaSchema,
  getDefaultMDXOptions,
  remarkInclude,
  // Type exports
  type AnyCollection,
  type BaseCollection,
  type CollectionSchema,
  type DefaultMDXOptions,
  type DocCollection,
  type DocsCollection,
  type GlobalConfig,
  type MetaCollection,
  type PostprocessOptions
} from './config';
```

### 4. Conflict Resolution

The enhanced `defineDocs`, `defineConfig`, and `defineCollections` functions in `src/core.ts` provide org-file support, so the config exports are selectively re-exported from main index to avoid conflicts while still providing access to the schemas and utility functions.

## Usage Examples

### Schema Usage
```typescript
import { frontmatterSchema, metaSchema } from 'fumadocs-org/config';

// Validate frontmatter
const result = frontmatterSchema.safeParse({
  title: "My Document",
  description: "Document description"
});

// Validate meta
const metaResult = metaSchema.safeParse({
  title: "Documentation",
  pages: ["intro", "guide"]
});
```

### Configuration Usage
```typescript
import { defineDocs, defineConfig } from 'fumadocs-org';

// Enhanced defineDocs with org support (from core)
const docs = defineDocs({
  docs: {
    schema: frontmatterSchema
  }
});

// Direct access to original fumadocs-mdx functions (from config)
import { defineDocs as mdxDefineDocs } from 'fumadocs-org/config';
```

## Testing and Verification

### Build Success
- ✅ Package builds successfully with all exports
- ✅ All 164 unit tests pass
- ✅ TypeScript compilation succeeds
- ✅ Config exports work correctly in runtime tests

### Export Verification
```javascript
// Test script results
✓ frontmatterSchema: object
✓ metaSchema: object
✓ Both schemas exported successfully
```

## Benefits

### 1. **Complete API Coverage**
- Users have access to all fumadocs-mdx configuration utilities
- No need to install both packages for configuration needs
- Consistent API surface across the ecosystem

### 2. **Backward Compatibility**
- Existing fumadocs-org functionality unchanged
- Enhanced functions in core still provide org-file support
- New exports are additive, not breaking

### 3. **Developer Experience**
- Single import source for schemas and configuration
- Type safety with all TypeScript exports
- Clear separation between enhanced core functions and direct aliases

## Files Modified

### Core Implementation
- `packages/fumadocs-org/src/config/index.ts` (new file - 21 lines)
- `packages/fumadocs-org/src/index.ts` (updated exports)
- `packages/fumadocs-org/package.json` (added config export)
- `packages/fumadocs-org/tsup.config.ts` (added config entry)

### Configuration
- No changes to existing core functionality
- No breaking changes to public API
- All existing tests continue to pass

## Conclusion

Successfully added all missing fumadocs-mdx config exports to fumadocs-org as aliases, providing users with complete access to schemas and configuration utilities while maintaining the enhanced org-file support in the core functions. The implementation ensures no conflicts while offering a comprehensive API surface.