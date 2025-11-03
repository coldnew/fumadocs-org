import { unified } from 'unified';
import parse from 'uniorg-parse';
import uniorg2rehype from 'uniorg-rehype';
import rehypeParse from 'rehype-parse';
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
  options: ConversionOptions = {},
): Promise<ConversionResult> {
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
    .use(require('rehype-stringify').default)
    .processSync(orgContent)
    .toString();

  // Replace math spans with LaTeX in HTML
  // Since uniorg marks all math as math-inline, use $$ for all math expressions
  html = html
    .replace(
      /<span class="math math-inline">([^<]+)<\/span>/g,
      (match, p1) => `$$${p1}$$`,
    )
    .replace(
      /<span class="math math-display">([^<]+)<\/span>/g,
      (match, p1) => `\n\n$${p1}$$\n\n`,
    );

  // Convert HTML with LaTeX to markdown
  const markdown = unified()
    .use(rehypeParse)
    .use(rehypeRemark)
    .use(remarkGfm)
    .use(remarkStringify)
    .processSync(html)
    .toString();

  // Generate frontmatter
  const frontmatter = matter.stringify('', keywords);

  return {
    frontmatter,
    markdown,
  };
}
