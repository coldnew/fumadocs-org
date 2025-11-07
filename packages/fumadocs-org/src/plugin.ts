import type { Plugin } from 'fumadocs-mdx';

/**
 * Helper function to extend isFileSupported to include .org files
 */
function extendFileSupported(
  originalIsFileSupported: (filePath: string) => boolean,
) {
  return (filePath: string) => {
    const originalSupported = originalIsFileSupported(filePath);
    const orgSupported = filePath.endsWith('.org');
    return originalSupported || orgSupported;
  };
}

/**
 * Plugin to extend fumadocs-mdx to support .org files
 * Enhances collections after they're built to include .org file support
 */
export function orgSupportPlugin(): Plugin {
  return {
    name: 'org-support',
    config(config) {
      // Enhance each collection to support .org files
      config.collectionList = config.collectionList.map((collection: any) => {
        if (collection.type === 'doc') {
          // Extend isFileSupported to include .org files
          return {
            ...collection,
            isFileSupported: extendFileSupported(collection.isFileSupported),
          };
        } else if (collection.type === 'docs') {
          // For docs collections, enhance both docs and meta
          return {
            ...collection,
            docs: {
              ...collection.docs,
              isFileSupported: extendFileSupported(
                collection.docs.isFileSupported,
              ),
            },
          };
        }
        return collection;
      });

      console.log('[ORG] Extended collections to support .org files');
      return config;
    },
  };
}
