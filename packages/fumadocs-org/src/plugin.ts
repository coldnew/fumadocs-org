import type { Plugin } from 'fumadocs-mdx';

/**
 * Plugin to extend fumadocs-mdx to support .org files
 * by modifying collection configurations to include org files
 */
export function orgSupportPlugin(): Plugin {
  return {
    name: 'org-support',
    config(config) {
      // Modify each doc collection to include .org files
      config.collectionList = config.collectionList.map((collection: any) => {
        if (collection.type === 'doc' || collection.type === 'docs') {
          // For doc collections, extend the files pattern to include .org
          if (collection.type === 'doc') {
            const files = collection.files || [`**/*.{mdx,md}`];

            // Check if .org is already included
            if (!files.some((pattern: string) => pattern.includes('.org'))) {
              // Add .org to the existing patterns
              const newFiles = files
                .map((pattern: string) => {
                  if (pattern.includes('{mdx,md}')) {
                    return pattern.replace('{mdx,md}', '{mdx,md,org}');
                  } else if (
                    pattern.includes('mdx') ||
                    pattern.includes('md')
                  ) {
                    // For patterns like "**/*.mdx", add org variant
                    const basePattern = pattern.replace(/\.(mdx|md)$/, '');
                    return [pattern, `${basePattern}.org`];
                  }
                  return pattern;
                })
                .flat();

              return {
                ...collection,
                files: newFiles,
                // Override isFileSupported to include .org files
                isFileSupported: (filePath: string) => {
                  const originalSupported =
                    collection.isFileSupported(filePath);
                  const orgSupported = filePath.endsWith('.org');
                  return originalSupported || orgSupported;
                },
              };
            }
          } else if (collection.type === 'docs') {
            // For docs collections, modify both docs and meta
            return {
              ...collection,
              docs: {
                ...collection.docs,
                files: collection.docs.files || [`**/*.{mdx,md,org}`],
                isFileSupported: (filePath: string) => {
                  const originalSupported =
                    collection.docs.isFileSupported(filePath);
                  const orgSupported = filePath.endsWith('.org');
                  return originalSupported || orgSupported;
                },
              },
            };
          }
        }

        return collection;
      });

      console.log('[ORG] Extended collections to support .org files');
      return config;
    },
  };
}
