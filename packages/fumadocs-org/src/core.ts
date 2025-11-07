import {
  defineDocs as defineMDXDocs,
  defineConfig as defineMDXConfig,
  defineCollections as defineMDXCollections,
  type DocsCollection,
} from 'fumadocs-mdx/config';
import { orgSupportPlugin } from './plugin';

/**
 * Enhanced defineDocs that automatically includes org file support
 * Reuses fumadocs-mdx's defineDocs with extended file patterns
 */
export function defineDocs(
  options: Parameters<typeof defineMDXDocs>[0],
): DocsCollection {
  // Extend file patterns to include .org files by leveraging existing fumadocs-mdx logic
  const enhancedOptions = {
    ...options,
    docs: {
      ...options.docs,
      // Always provide explicit file patterns to include .org files
      files: options.docs?.files
        ? extendFilePatterns(options.docs.files)
        : [`**/*.{mdx,md,org}`], // Explicitly include org files in default pattern
    },
  };

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
  return defineMDXConfig({
    ...config,
    plugins: [orgSupportPlugin(), ...(config?.plugins || [])],
  });
}

export { defineMDXCollections as defineCollections };
export * from './plugin';
