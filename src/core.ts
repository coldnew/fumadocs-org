import {
  defineDocs as defineMDXDocs,
  defineConfig as defineMDXConfig,
  defineCollections as defineMDXCollections,
  type DocsCollection,
} from 'fumadocs-mdx/config';

/**
 * Enhanced defineDocs that supports org file processing
 * Automatically extends file patterns to include .org files
 */
export function defineDocs(
  options: Parameters<typeof defineMDXDocs>[0],
): DocsCollection {
  const enhancedOptions = {
    ...options,
    docs: {
      ...options.docs,
    },
  };

  // Always extend file patterns to include .org files
  const files = options.docs?.files ?? ['**/*.mdx', '**/*.md'];
  enhancedOptions.docs.files = extendFilePatterns(files);

  return defineMDXDocs(enhancedOptions);
}

/**
 * Helper function to extend file patterns to include .org files
 * Follows fumadocs-mdx's internal pattern for file extensions
 */
function extendFilePatterns(patterns: string[]): string[] {
  return patterns
    .map((pattern: string) => {
      // Handle fumadocs-mdx's standard pattern format
      if (pattern.includes('{mdx,md}')) {
        return pattern.replace('{mdx,md}', '{mdx,md,org}');
      } else if (pattern.includes('mdx') || pattern.includes('md')) {
        // For specific patterns like "**/*.mdx", add org variant
        const basePattern = pattern.replace(/\.(mdx|md)$/, '');
        return [pattern, `${basePattern}.org`];
      }
      return pattern;
    })
    .flat();
}

/**
 * Enhanced defineConfig that automatically includes org file support
 */
export function defineConfig(config?: Parameters<typeof defineMDXConfig>[0]) {
  return defineMDXConfig(config);
}

export { defineMDXCollections as defineCollections };
