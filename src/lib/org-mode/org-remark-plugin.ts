import { unified } from 'unified';
import parse from 'uniorg-parse';
import uniorg2rehype from 'uniorg-rehype';
import rehypeRemark from 'rehype-remark';
import remarkStringify from 'remark-stringify';
import type { Plugin } from 'unified';
import type { VFile } from 'vfile';

/**
 * Remark plugin to process .org files by converting them to Markdown
 */
export const orgRemarkPlugin: Plugin = function orgRemarkPlugin() {
  return function transformer(_tree: any, file: VFile) {
    // Check if this is an .org file
    if (file.path && file.path.endsWith('.org')) {
      // Get the original org content
      const orgContent = String(file.value);

      // Convert org to markdown
      const markdownContent = unified()
        .use(parse)
        .use(uniorg2rehype)
        .use(rehypeRemark)
        .use(remarkStringify)
        .processSync(orgContent)
        .toString();

      // Replace the file content with markdown
      file.value = markdownContent;

      // Change the file extension for further processing
      if (file.path) {
        file.path = file.path.replace(/\.org$/, '.md');
      }
    }
  };
};
