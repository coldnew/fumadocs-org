import { unified } from 'unified';
import parse from 'uniorg-parse';
import uniorg2rehype from 'uniorg-rehype';
import rehype2remark from 'rehype-remark';
import remarkGfm from 'remark-gfm';
import remarkStringify from 'remark-stringify';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import { visit } from 'unist-util-visit';
import matter from 'gray-matter';
import type {
  ConversionOptions,
  ConversionResult,
  OrgConversionResult,
} from './types';
import { generateDefaultTitle } from './utils';
import { processBlocks, restoreBlocks } from './blocks';
import { createBlockContext } from './blocks/types';
import { createPluginContext } from './types';
import {
  orgCaptions,
  orgCheckboxes,
  orgTableAlignment,
  rehypeCaptionsAndTableAlignment,
  restoreCheckboxes,
} from './plugins';

/**
 * Get Fumadocs callout type from Org-mode callout type
 */
export function extractOrgKeywords(content: string): Record<string, string> {
  const keywordRegex = /^#\+(\w+):\s*(.+)$/gm;
  const keywords: Record<string, string> = {};
  let match;

  while ((match = keywordRegex.exec(content)) !== null) {
    const key = match[1].toLowerCase();
    const value = match[2].trim();
    // Skip options, latex_header, and date as they may cause issues
    if (key !== 'options' && key !== 'latex_header' && key !== 'date') {
      keywords[key] = value;
    }
  }

  return keywords;
}

export function getCalloutTypeFromOrgType(orgType: string): string | null {
  const calloutMap: Record<string, string> = {
    warning: 'warning',
    error: 'error',
    info: 'info',
    note: 'note',
    tip: 'tip',
    caution: 'caution',
  };

  return calloutMap[orgType.toLowerCase()] || null;
}

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
 */
export async function convertOrgToMdx(
  orgContent: string,
  filename: string,
  options: ConversionOptions = {},
): Promise<ConversionResult> {
  // Extract keywords first before modifying content
  const keywords = extractOrgKeywords(orgContent);

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

/**
 * Convert MDX content to Org-mode with keywords
 */
export async function convertMdxToOrg(
  mdxContent: string,
  filename: string,
): Promise<OrgConversionResult> {
  // Extract frontmatter
  const { data: frontmatter, content: mdxWithoutFrontmatter } =
    matter(mdxContent);

  // Convert frontmatter to Org keywords
  const keywords = Object.entries(frontmatter)
    .map(([key, value]) => `#+${key.toUpperCase()}: ${value}`)
    .join('\n');

  // Parse MDX
  const processor = unified().use(remarkParse).use(remarkGfm).use(remarkMdx);

  const tree = processor.parse(mdxWithoutFrontmatter + '\n');

  // Convert AST to Org
  const orgContent = astToOrg(tree);

  return {
    keywords: keywords ? keywords + '\n\n' : '',
    org: orgContent,
  };
}

/**
 * Convert MDX AST to Org syntax
 */
function astToOrg(node: any): string {
  switch (node.type) {
    case 'root':
      return node.children.map(astToOrg).join('');
    case 'heading':
      return (
        '*'.repeat(node.depth) +
        ' ' +
        node.children.map(astToOrg).join('') +
        '\n\n'
      );
    case 'paragraph':
      return node.children.map(astToOrg).join('') + '\n\n';
    case 'text':
      return node.value;
    case 'list':
      return node.children.map(astToOrg).join('') + '\n';
    case 'listItem':
      return (
        '- ' +
        node.children.map((child: any) => astToOrg(child).trimEnd()).join('') +
        '\n'
      );
    case 'code':
      if (node.lang) {
        return `#+begin_src ${node.lang}\n${node.value}\n#+end_src\n\n`;
      } else {
        return `#+begin_example\n${node.value}\n#+end_example\n\n`;
      }
    case 'inlineCode':
      return `=${node.value}=`;
    case 'link':
      return `[[${node.url}][${node.children.map(astToOrg).join('')}]]`;
    case 'strong':
      return '*' + node.children.map(astToOrg).join('') + '*';
    case 'emphasis':
      return '/' + node.children.map(astToOrg).join('') + '/';
    case 'mdxJsxFlowElement':
      return `#+begin_export jsx\n${mdxJsxToString(node)}\n#+end_export\n\n`;
    case 'mdxJsxTextElement':
      return `#+begin_export jsx\n${mdxJsxToString(node)}\n#+end_export`;
    case 'blockquote':
      return (
        node.children.map((child: any) => astToOrg(child).trimEnd()).join('') +
        '\n\n'
      );
    case 'thematicBreak':
      return '-----\n\n';
    case 'table':
      const rows = node.children.map(
        (row: any) =>
          '| ' +
          row.children
            .map((cell: any) => cell.children.map(astToOrg).join(''))
            .join(' | ') +
          ' |\n',
      );
      // Add separator row after header
      if (rows.length > 0) {
        const headerRow = node.children[0];
        const separatorParts = headerRow.children.map((cell: any) => {
          const content = cell.children.map(astToOrg).join('');
          return '-'.repeat(content.length + 2); // +2 for spaces around content
        });
        const separator = '|' + separatorParts.join('|') + '|\n';
        rows.splice(1, 0, separator);
      }
      return rows.join('') + '\n';
    default:
      return '';
  }
}

/**
 * Convert child nodes to Org
 */
function childToOrg(node: any): string {
  switch (node.type) {
    case 'text':
      return node.value;
    case 'strong':
      return '*' + node.children.map(childToOrg).join('') + '*';
    case 'emphasis':
      return '/' + node.children.map(childToOrg).join('') + '/';
    case 'inlineCode':
      return `=${node.value}=`;
    case 'link':
      return `[[${node.url}][${node.children.map(childToOrg).join('')}]]`;
    case 'mdxJsxTextElement':
      return `#+begin_export jsx\n${mdxJsxToString(node)}\n#+end_export`;
    default:
      return '';
  }
}

/**
 * Convert MDX JSX element to string
 */
function mdxJsxToString(node: any): string {
  let jsx = '<' + node.name;
  if (node.attributes) {
    jsx += node.attributes
      .map((attr: any) => {
        if (attr.type === 'mdxJsxAttribute') {
          return ` ${attr.name}${attr.value ? `="${attr.value}"` : ''}`;
        }
        return '';
      })
      .join('');
  }
  jsx += '>';
  if (node.children) {
    jsx += node.children.map(childToOrg).join('');
  }
  jsx += `</${node.name}>`;
  return jsx;
}
