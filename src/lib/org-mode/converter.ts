import { unified } from 'unified';
import parse from 'uniorg-parse';
import uniorg2rehype from 'uniorg-rehype';
import rehypeParse from 'rehype-parse';
import rehypeRemark from 'rehype-remark';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';

import remarkStringify from 'remark-stringify';
import matter from 'gray-matter';
import type { ConversionOptions, ConversionResult } from './types';
import { extractOrgKeywords, generateDefaultTitle } from './utils';

/**
 * Get Fumadocs callout type from Org-mode callout type
 */
function getCalloutTypeFromOrgType(orgType: string): string | null {
  const calloutMap: Record<string, string> = {
    warning: 'warning',
    note: 'info',
    tip: 'success',
    info: 'info',
    success: 'success',
    error: 'error',
  };

  return calloutMap[orgType.toLowerCase()] || null;
}

/**
 * Convert Org-mode content to MDX with frontmatter
 */
export async function convertOrgToMdx(
  orgContent: string,
  filename: string,
  options: ConversionOptions = {},
): Promise<ConversionResult> {
  // Extract callouts for separate processing
  const callouts: Array<{ type: string; content: string; index: number }> = [];
  let calloutIndex = 0;
  orgContent = orgContent.replace(
    /#\+begin_(\w+)\s*\n([\s\S]*?)#\+end_\1/g,
    (match, type, content) => {
      const calloutType = getCalloutTypeFromOrgType(type);
      if (calloutType) {
        callouts.push({
          type: calloutType,
          content: content.trim(),
          index: calloutIndex,
        });
        const placeholder = `CALLOUTMARKER${calloutIndex}`;
        calloutIndex++;
        return placeholder;
      }
      return match;
    },
  );

  // Extract keywords
  const keywords = extractOrgKeywords(orgContent);

  // Set defaults
  if (!keywords.title) {
    keywords.title = options.defaultTitle || generateDefaultTitle(filename);
  }
  if (!keywords.description) {
    keywords.description =
      options.defaultDescription || 'Generated from Org-mode';
  }

  // Convert to HTML first
  let html = unified()
    .use(parse)
    .use(uniorg2rehype)
    .use(rehypeKatex)
    .use(require('rehype-stringify').default)
    .processSync(orgContent)
    .toString();

  // Math spans are left as-is for rehype-remark to handle

  // Convert HTML with LaTeX to markdown
  let markdown = unified()
    .use(rehypeParse)
    .use(rehypeRemark)
    .use(remarkGfm)
    .use(remarkStringify)
    .processSync(html)
    .toString();

  // Process and restore callouts
  for (const callout of callouts) {
    // Process callout content separately
    const calloutHtml = unified()
      .use(parse)
      .use(uniorg2rehype)
      .use(require('rehype-stringify').default)
      .processSync(callout.content)
      .toString();

    // Convert callout HTML to markdown
    const calloutMarkdown = unified()
      .use(rehypeParse)
      .use(rehypeRemark)
      .use(remarkGfm)
      .use(remarkStringify)
      .processSync(calloutHtml)
      .toString();

    // Replace marker with Callout component
    const marker = `CALLOUTMARKER${callout.index}`;
    markdown = markdown.replace(
      marker,
      `<Callout type="${callout.type}">\n${calloutMarkdown}\n</Callout>`,
    );
  }

  // Unescape Callout tags that were escaped by remark-stringify
  markdown = markdown.replace(/\\<Callout/g, '<Callout');
  markdown = markdown.replace(/\\<\/Callout>/g, '</Callout>');

  // Generate frontmatter
  const frontmatter = matter.stringify('', keywords);

  return {
    frontmatter,
    markdown,
  };
}
