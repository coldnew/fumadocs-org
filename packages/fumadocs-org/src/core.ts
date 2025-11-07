import {
  defineDocs as defineMDXDocs,
  defineConfig as defineMDXConfig,
  defineCollections as defineMDXCollections,
  type DocsCollection,
} from 'fumadocs-mdx/config';
import { orgSupportPlugin } from './plugin';

// Core functionality for fumadocs-org package
export function createOrgSource() {
  // Placeholder for Org-mode source creation functionality
  return {
    // Basic structure for Fumadocs source integration
  };
}

/**
 * Enhanced defineDocs that automatically includes org file support
 */
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
        : [`**/*.{mdx,md,org}`],
    },
  };

  return defineMDXDocs(enhancedOptions);
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
