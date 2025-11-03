import { unified } from 'unified';
import parse from 'uniorg-parse';
import uniorg2rehype from 'uniorg-rehype';
import rehypeRemark from 'rehype-remark';
import remarkGfm from 'remark-gfm';
import remarkStringify from 'remark-stringify';
import matter from 'gray-matter';
import type { ConversionOptions, ConversionResult } from './types';
import { extractOrgKeywords, generateDefaultTitle } from './utils';

/**
 * Convert Org-mode content to MDX with frontmatter
 */
export async function convertOrgToMdx(
  orgContent: string,
  filename: string,
  options: ConversionOptions = {}
): Promise<ConversionResult> {
  // Extract keywords
  const keywords = extractOrgKeywords(orgContent);

  // Set defaults
  if (!keywords.title) {
    keywords.title = options.defaultTitle || generateDefaultTitle(filename);
  }
  if (!keywords.description) {
    keywords.description = options.defaultDescription || 'Generated from Org-mode';
  }

  // Convert to markdown
  const markdown = unified()
    .use(parse)
    .use(uniorg2rehype)
    .use(rehypeRemark)
    .use(remarkGfm)
    .use(remarkStringify)
    .processSync(orgContent)
    .toString();

  // Generate frontmatter
  const frontmatter = matter.stringify('', keywords);

  return {
    frontmatter,
    markdown,
  };
}