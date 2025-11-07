# Implement fumadocs-org with Org-mode Support

## Task Overview
Create a comprehensive fumadocs-org package that provides seamless org-mode file support for fumadocs documentation system, allowing users to use `.org` files alongside `.mdx` files without manual configuration.

## Requirements
- [X] Remove explicit plugin usage from `source.config.ts`
- [X] Create fumadocs-org's own `defineDocs` function compatible with fumadocs-mdx's `defineDocs` but extended with org mode support
- [X] Create fumadocs-org's own `defineConfig` function that automatically includes org support plugin
- [X] Fix runtime errors and ensure org files are properly processed
- [X] Test complete implementation with working org file access

## Implementation Details

### 1. Enhanced Core Functions (`packages/fumadocs-org/src/core.ts`)

#### Enhanced `defineDocs` Function
```typescript
export function defineDocs(
  options: Parameters<typeof defineMDXDocs>[0],
): DocsCollection {
  // Modify the options to include org files before passing to the original defineDocs
  const enhancedOptions = {
    ...options,
    docs: {
      ...options.docs,
      files: options.docs?.files
        ? options.docs.files
            .map((pattern: string) => {
              if (pattern.includes('{mdx,md}')) {
                return pattern.replace('{mdx,md}', '{mdx,md,org}');
              } else if (pattern.includes('mdx') || pattern.includes('md')) {
                // For patterns like "**/*.mdx", add org variant
                const basePattern = pattern.replace(/\.(mdx|md)$/, '');
                return [pattern, `${basePattern}.org`];
              }
              return pattern;
            })
            .flat()
        : [`**/*.{mdx,md,org}`]
    },
  };

  return defineMDXDocs(enhancedOptions);
}
```

**Purpose**: Automatically extends file patterns to include `.org` files without requiring manual configuration.

#### Enhanced `defineConfig` Function
```typescript
export function defineConfig(config?: Parameters<typeof defineMDXConfig>[0]) {
  return defineMDXConfig({
    ...config,
    plugins: [orgSupportPlugin(), ...(config?.plugins || [])],
  });
}
```

**Purpose**: Automatically includes the org support plugin so users don't need to manually add it.

### 2. Org Support Plugin (`packages/fumadocs-org/src/plugin.ts`)

The plugin extends fumadocs-mdx collections to support `.org` files by:

- Modifying collection configurations to include `.org` file patterns
- Adding `isFileSupported` checks for `.org` extensions
- Providing debug logging for collection modifications

### 3. Runtime Implementation (`packages/fumadocs-org/src/runtime/next/index.ts`)

**Simplified Approach**: Instead of recreating complex runtime logic, the implementation re-exports everything from `fumadocs-mdx/runtime/next`:

```typescript
// Re-export everything from fumadocs-mdx runtime/next
// Our enhanced defineDocs and defineConfig handle the org file support
export * from 'fumadocs-mdx/runtime/next';
```

**Benefits**: 
- Leverages proven fumadocs-mdx runtime functionality
- Avoids complex type compatibility issues
- Ensures consistent behavior with existing fumadocs projects

### 4. Package Configuration (`packages/fumadocs-org/package.json`)

Enhanced exports to provide both main functionality and plugin access:

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    },
    "./plugin": {
      "types": "./dist/plugin.d.ts",
      "import": "./dist/plugin.mjs",
      "require": "./dist/plugin.js"
    },
    "./next": {
      "types": "./dist/next/index.d.ts",
      "import": "./dist/next/index.mjs",
      "require": "./dist/next/index.js"
    },
    "./runtime/next": {
      "types": "./dist/runtime/next/index.d.ts",
      "import": "./dist/runtime/next/index.mjs",
      "require": "./dist/runtime/next/index.js"
    },
    "./loader-org": "./loader-org.cjs"
  }
}
```

### 5. Source Configuration (`src/lib/source.ts`)

Updated to use the standard fumadocs pattern:

```typescript
import { docs } from '@/.source';
import { loader } from 'fumadocs-core/source';

// Org-mode source is handled by enhanced defineDocs in source.config.ts
// Use toFumadocsSource() method like in working examples
export const source = loader({
  baseUrl: '/docs',
  source: (docs as any).toFumadocsSource(),
});
```

**Key Insight**: The generated `.source/index.ts` exports a `docs` object with a `toFumadocsSource()` method that properly converts the processed data for the loader.

### 6. Configuration Integration (`source.config.ts`)

Simplified user configuration by using fumadocs-org functions:

```typescript
import {
  defineConfig,
  defineDocs,
  defineCollections,
} from 'fumadocs-org';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { shikiLanguages } from '@/lib/shiki/languages';
import { bundledLanguages } from 'shiki';

export const docs = defineDocs({
  dir: 'content/docs',
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkMath],
    rehypePlugins: (v) => [rehypeKatex, ...v],
    rehypeCodeOptions: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      langs: [
        ...Object.values(bundledLanguages),
        ...shikiLanguages,
        mathLanguage,
      ],
    },
  },
});
```

**Benefits**:
- No explicit plugin configuration needed
- Automatic org file inclusion
- Clean, readable configuration
- Backward compatible with fumadocs-mdx API

## Technical Challenges Solved

### 1. Runtime Type Compatibility Issues
**Problem**: Initial attempts to create custom runtime resulted in complex type errors with `Doc`, `Meta`, and `VirtualFile` types.

**Solution**: Simplified by re-exporting fumadocs-mdx runtime functionality, which is already proven and type-safe.

### 2. Collection Processing Logic
**Problem**: Understanding how to properly extend file patterns and integrate with fumadocs collection system.

**Solution**: Enhanced `defineDocs` to modify file patterns before passing to original fumadocs-mdx function, ensuring seamless integration.

### 3. Source Data Flow
**Problem**: `TypeError: docs is not iterable` when trying to pass processed docs directly to `createMDXSource`.

**Solution**: Used the `docs.toFumadocsSource()` method which properly converts the processed data structure for the loader.

### 4. Import Path Resolution
**Problem**: Correct import paths for enhanced functions and ensuring proper package exports.

**Solution**: Structured package exports and re-exports to provide clean public API while maintaining internal organization.

## Testing Results

### ✅ Functional Tests
- Org files are automatically included in documentation collections
- Routes like `/docs/org-mode/` and `/docs/org-mode/callouts` work correctly
- No runtime errors during development server startup
- MDX generation completes successfully with org files

### ✅ Integration Tests
- Plugin automatically extends collections (confirmed by debug output)
- Enhanced `defineDocs` properly modifies file patterns
- Enhanced `defineConfig` includes plugin without manual configuration
- Source loader correctly processes org files

### ✅ Quality Assurance
- Lint checks pass without errors
- TypeScript compilation succeeds
- Package builds correctly with all exports
- Development server starts and serves content properly

## File Structure Created/Modified

### New Files
- `packages/fumadocs-org/src/core.ts` - Enhanced defineDocs and defineConfig functions
- `packages/fumadocs-org/src/plugin.ts` - Org support plugin for fumadocs-mdx
- `packages/fumadocs-org/src/runtime/next/index.ts` - Simplified runtime re-exports
- `packages/fumadocs-org/tsup.config.ts` - Build configuration including plugin entry

### Modified Files
- `packages/fumadocs-org/package.json` - Enhanced exports configuration
- `packages/fumadocs-org/src/index.ts` - Export core functionality
- `source.config.ts` - Updated to use fumadocs-org functions
- `src/lib/source.ts` - Updated to use proper source pattern

## Usage Instructions

### For Users
Simply replace imports from `fumadocs-mdx/config` with `fumadocs-org`:

```typescript
// Before
import { defineConfig, defineDocs } from 'fumadocs-mdx/config';

// After  
import { defineConfig, defineDocs } from 'fumadocs-org';
```

No other configuration changes required - org files will be automatically supported!

### For Developers
The fumadocs-org package provides:
- Enhanced `defineDocs` with automatic org file pattern inclusion
- Enhanced `defineConfig` with automatic org plugin integration
- Access to org support plugin for advanced use cases
- Runtime compatibility with existing fumadocs-mdx functionality

## Future Enhancements

### Potential Improvements
1. **Advanced Org Features**: Support for more org-mode specific features like TODO items, scheduling, and property drawers
2. **Performance Optimization**: Caching for org-to-mdx conversion results
3. **Enhanced Error Handling**: Better error messages for org syntax issues
4. **Development Tools**: Org-mode specific linting and validation tools

### Integration Opportunities
1. **UI Components**: Org-mode specific UI components for special syntax
2. **Search Integration**: Enhanced search that understands org-mode structure
3. **Export Options**: Additional export formats from org files
4. **Live Preview**: Real-time org-to-mdx conversion during development

## Conclusion

Successfully implemented a comprehensive fumadocs-org package that provides seamless org-mode support for fumadocs documentation system. The implementation:

- ✅ **Eliminates Manual Configuration**: Users don't need to manually add plugins or modify file patterns
- ✅ **Maintains Compatibility**: Fully backward compatible with existing fumadocs-mdx API
- ✅ **Provides Clean API**: Simple import change from `fumadocs-mdx/config` to `fumadocs-org`
- ✅ **Handles Processing**: Proper integration with fumadocs build pipeline and runtime system
- ✅ **Supports All Org Files**: Automatic inclusion of `.org` files in documentation collections

The solution is production-ready and provides a solid foundation for org-mode documentation within the fumadocs ecosystem.