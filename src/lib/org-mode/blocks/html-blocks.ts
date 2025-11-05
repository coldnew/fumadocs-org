import { htmlToJsx } from 'html-to-jsx-transform';
import type { HtmlBlock } from '@/lib/org-mode/types';
import type { BlockContext } from './types';
import { MARKERS } from '@/lib/org-mode/constants';

/**
 * Process HTML blocks in org content
 */
export function processHtmlBlocks(
  content: string,
  context: BlockContext,
): string {
  let result = content;
  let htmlIndex = 0;

  result = result.replace(/^#\+html:\s*(.+)$/gim, (_, html: string) => {
    context.htmlBlocks.push({
      html: html.trim(),
      index: htmlIndex,
    });
    return `${MARKERS.HTML_BLOCK}${htmlIndex++}`;
  });

  return result;
}

/**
 * Restore HTML blocks in markdown
 */
export function restoreHtmlBlocks(
  markdown: string,
  context: BlockContext,
): string {
  return markdown.replace(
    new RegExp(`${MARKERS.HTML_BLOCK}(\\d+)`, 'g'),
    (_, index: string) => {
      const blockIndex = parseInt(index);
      const block = context.htmlBlocks[blockIndex];
      if (!block) return '';

      return htmlToJsx(block.html);
    },
  );
}
