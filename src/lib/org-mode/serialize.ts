import parse from 'uniorg-parse';
import uniorg2rehype from 'uniorg-rehype';
import rehype2remark from 'rehype-remark';
import remarkGfm from 'remark-gfm';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';
import matter from 'gray-matter';
import type { ConversionOptions, ConversionResult } from '@/lib/org-mode/types';
import { createBlockContext } from '@/lib/org-mode/blocks/types';
import { createPluginContext } from '@/lib/org-mode/types';
import {
  extractOrgKeywords,
  getCalloutTypeFromOrgType,
} from '@/lib/org-mode/keywords';
import { parseTime, formatToISOString } from '@/lib/org-mode/time';
import { generateDefaultTitle } from '@/lib/org-mode/utils';
import { processBlocks, restoreBlocks } from '@/lib/org-mode/blocks';
import {
  orgCaptions,
  orgCheckboxes,
  orgTableAlignment,
  rehypeCaptionsAndTableAlignment,
  restoreCheckboxes,
} from '@/lib/org-mode/plugins';

/**
 * Plugin to convert figure elements to HTML strings
 */
function convertFiguresToHtml() {
  return (tree: any) => {
    visit(tree, 'element', (element: any, index?: number, parent?: any) => {
      if (element.tagName === 'figure' && index !== undefined && parent) {
        const img = element.children[0];
        const figcaption = element.children[1];
        const imgSrc = img.properties.src || '';
        const imgAlt = img.properties.alt || '';
        const imgHtml = `<img src="${imgSrc}" alt="${imgAlt}" />`;
        const figcaptionText = figcaption.children[0].value;
        const figcaptionHtml = `<figcaption>${figcaptionText}</figcaption>`;
        const html = `<figure>${imgHtml}${figcaptionHtml}</figure>`;
        const htmlNode = {
          type: 'html',
          value: html,
        };
        parent.children[index] = htmlNode;
      }
    });
  };
}

/**
 * Convert Org-mode content to MDX with frontmatter
 *
 * This function serializes Org-mode syntax into MDX format,
 * extracting keywords into frontmatter and converting the content
 * through a unified AST pipeline.
 */
export async function convertOrgToMdx(
  orgContent: string,
  filename: string,
  options: ConversionOptions = {},
): Promise<ConversionResult> {
  // Extract keywords first before modifying content
  const keywords = extractOrgKeywords(orgContent);

  // Parse date if present
  if (keywords.date) {
    const parsedDate = parseTime(keywords.date);
    if (parsedDate) {
      keywords.date = formatToISOString(parsedDate);
    }
  }

  // Set defaults
  if (!keywords.title) {
    keywords.title = options.defaultTitle || generateDefaultTitle(filename);
  }
  if (!keywords.description) {
    keywords.description =
      options.defaultDescription || 'Generated from Org-mode';
  }

  // Create block context for modular processing
  const blockContext = createBlockContext();

  // Create plugin context for modular plugins
  const pluginContext = createPluginContext();

  // Process all blocks using the modular system
  orgContent = processBlocks(orgContent, blockContext);

  // Handle example blocks (keeping separate for now)
  const exampleBlocks: Array<{ content: string }> = [];
  orgContent = orgContent.replace(
    /#\+begin_example\s*\n([\s\S]*?)#\+end_example/g,
    (_, content) => {
      exampleBlocks.push({ content });
      return `EXAMPLEBLOCKMARKER${exampleBlocks.length - 1}`;
    },
  );

  // Handle comment blocks
  orgContent = orgContent.replace(
    /#\+begin_comment\s*\n([\s\S]*?)#\+end_comment/g,
    () => {
      return '';
    },
  );

  // Extract callouts for separate processing
  const callouts: Array<{ type: string; content: string; index: number }> = [];
  let calloutIndex = 0;
  orgContent = orgContent.replace(
    /#\+begin_(\w+)\s*\n([\s\S]*?)#\+end_\1/g,
    (_, type: string, content: string) => {
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
      return _;
    },
  );

  // Convert using direct AST pipeline (inspired by org2mdx)
  const processor = unified()
    .use(parse)
    .use(orgCaptions, pluginContext)
    .use(orgCheckboxes, pluginContext)
    .use(orgTableAlignment, pluginContext)
    .use(uniorg2rehype)
    .use(rehypeCaptionsAndTableAlignment, pluginContext)
    .use(convertFiguresToHtml)
    .use(rehype2remark)
    .use(remarkGfm)
    .use(remarkStringify);

  const file = processor.processSync(orgContent);
  let markdown = String(file).trim();

  // Post-process markdown to restore checkboxes
  markdown = restoreCheckboxes(orgContent, markdown);

  // Process and restore callouts
  for (const callout of callouts) {
    // Process callout content separately
    const calloutMarkdown = processor
      .processSync(callout.content)
      .toString()
      .trim();
    // Replace marker with Callout component
    const marker = `CALLOUTMARKER${callout.index}`;
    markdown = markdown.replace(
      marker,
      `<Callout type="${callout.type}">\n${calloutMarkdown}\n</Callout>`,
    );
  }

  // Restore all blocks using the modular system
  markdown = restoreBlocks(markdown, blockContext);

  // Restore example blocks
  markdown = markdown.replace(/EXAMPLEBLOCKMARKER(\d+)/g, (_, index) => {
    const block = exampleBlocks[parseInt(index)];
    const trimmed = block.content.replace(/^\n+/, '').replace(/\n+$/, '');
    return `\`\`\`\n${trimmed}\n\`\`\``;
  });

  // Generate frontmatter
  const frontmatter = matter.stringify('', keywords);

  // Unescape HTML tags in html nodes
  markdown = markdown.replace(/\\</g, '<').replace(/\\>/g, '>');

  return {
    frontmatter,
    markdown,
  };
}
