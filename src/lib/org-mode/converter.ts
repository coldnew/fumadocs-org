import { unified } from 'unified';
import parse from 'uniorg-parse';
import uniorg2rehype from 'uniorg-rehype';
import rehype2remark from 'rehype-remark';
import remarkGfm from 'remark-gfm';
import remarkStringify from 'remark-stringify';
import { visit } from 'unist-util-visit';
import matter from 'gray-matter';
import type { ConversionOptions, ConversionResult } from './types';
import { generateDefaultTitle } from './utils';

// Global variables for passing data between plugins
let globalTableAlignments: any[] = [];
let globalCaptions: any[] = [];

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
 * Function to convert Org AST to HTML text
 */
function astToHtml(ast: any[]): string {
  return ast
    .map((node) => {
      if (node.type === 'text') return node.value;
      if (node.type === 'bold')
        return '<strong>' + astToHtml(node.children) + '</strong>';
      if (node.type === 'italic')
        return '<em>' + astToHtml(node.children) + '</em>';
      if (node.type === 'code') return '<code>' + node.value + '</code>';
      if (node.type === 'verbatim') return '<code>' + node.value + '</code>';
      // Add more types as needed
      return '';
    })
    .join('');
}

/**
 * Plugin to handle Org captions and other affiliated keywords
 */
function orgCaptions() {
  return (tree: any) => {
    globalCaptions = [];
    let captionIndex = 0;
    visit(tree, ['paragraph', 'link'], (node: any) => {
      if (node.affiliated && node.affiliated.CAPTION) {
        // This node has a caption
        const caption = astToHtml(node.affiliated.CAPTION[0]).trim();

        // Store caption info
        globalCaptions.push({ index: captionIndex++, caption });

        // Remove the affiliated data
        delete node.affiliated;
      }
    });
  };
}

/**
 * Plugin to handle Org table alignment
 */
function orgTableAlignment() {
  return (tree: any) => {
    globalTableAlignments = [];
    let tableIndex = 0;
    visit(tree, 'table', (table: any) => {
      const rows = table.children || [];

      // Check if we have at least 3 rows (header, separator, potential alignment)
      if (rows.length < 3) return;

      // Check if the third row contains alignment markers
      const alignmentRow = rows[2];
      if (!alignmentRow || alignmentRow.rowType !== 'standard') return;

      const alignmentCells = alignmentRow.children || [];
      const alignments: (string | null)[] = [];

      // Extract alignment from each cell
      for (const cell of alignmentCells) {
        const text = cell.children?.[0]?.value?.trim();
        if (text === '<l>') {
          alignments.push('left');
        } else if (text === '<c>') {
          alignments.push('center');
        } else if (text === '<r>') {
          alignments.push('right');
        } else {
          alignments.push(null); // default (no alignment marker)
        }
      }

      // Check if this row actually contains alignment markers
      const hasAlignmentMarkers = alignments.some((align) => align !== null);
      if (!hasAlignmentMarkers) return;

      // Store alignment info with table index
      globalTableAlignments.push({ index: tableIndex++, alignments });

      // Check if the header row is empty - if so, use the data row as header
      const headerRow = rows[0];
      const dataRow = rows[3];

      if (headerRow && headerRow.rowType === 'standard') {
        const headerCells = headerRow.children || [];
        const isEmptyHeader = headerCells.every(
          (cell: any) =>
            !cell.children ||
            !cell.children[0] ||
            !cell.children[0].value.trim(),
        );

        if (isEmptyHeader && dataRow) {
          // Replace empty header with data row content
          headerRow.children = dataRow.children;
          // Remove the data row (now duplicated)
          table.children.splice(3, 1);
        }
      }

      // Remove the alignment row from the table
      table.children.splice(2, 1);
    });
  };
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
 * Custom rehype plugin to handle math, captions and table alignment
 */
function rehypeCaptionsAndTableAlignment() {
  return (tree: any) => {
    let tableIndex = 0;
    let imgIndex = 0;

    visit(tree, 'element', (element: any, index?: number, parent?: any) => {
      // Handle math expressions
      if (
        (element.tagName === 'code' || element.tagName === 'span') &&
        element.properties?.className?.includes('math') &&
        index !== undefined &&
        parent
      ) {
        const className = element.properties.className;
        const isInline = Array.isArray(className)
          ? className.includes('math-inline')
          : className.includes('math-inline');
        let mathContent = element.children?.[0]?.value || '';
        // Trim and remove surrounding $ if present
        mathContent = mathContent.trim().replace(/^\$+|\$+$/g, '');

        // Check if this is actually display math by looking at parent context
        // Display math has a newline in the preceding text
        const isDisplayMath =
          parent &&
          parent.children &&
          parent.children.length >= 2 &&
          parent.children[0].type === 'text' &&
          parent.children[0].value.includes('\n');

        if (isInline && !isDisplayMath) {
          // Replace with $...$
          parent.children[index] = {
            type: 'text',
            value: `$${mathContent}$`,
          };
        } else {
          // Replace with display math $$...$$
          parent.children[index] = {
            type: 'text',
            value: `$$\n${mathContent}\n$$`,
          };
        }
      }

      // Handle captions for images
      if (element.tagName === 'img') {
        // Handle file: prefix in src
        if (
          element.properties.src &&
          element.properties.src.startsWith('file:')
        ) {
          element.properties.src = element.properties.src.slice(5);
          if (!element.properties.alt) {
            element.properties.alt = 'img';
          }
        }

        const captionInfo = globalCaptions[imgIndex++];
        if (captionInfo && index !== undefined && parent) {
          // Wrap the img in a figure
          const figure = {
            type: 'element',
            tagName: 'figure',
            properties: {},
            children: [
              element,
              {
                type: 'element',
                tagName: 'figcaption',
                properties: {},
                children: [
                  {
                    type: 'text',
                    value: captionInfo.caption,
                  },
                ],
              },
            ],
          };

          // Replace the element with figure
          parent.children[index] = figure;
        }
      }

      // Handle table alignment
      if (element.tagName === 'table') {
        const alignmentInfo = globalTableAlignments[tableIndex++];
        if (!alignmentInfo) return;

        const alignments = alignmentInfo.alignments;

        // Check if we need to create thead/tbody structure
        const tbody = element.children?.find(
          (child: any) => child.tagName === 'tbody',
        );
        if (tbody && tbody.children && tbody.children.length >= 2) {
          // Assume first row is header, second is separator
          const headerRow = tbody.children[0];
          const separatorRow = tbody.children[1];

          // Check if separator row contains dashes (indicating it's a separator)
          const isSeparator = separatorRow.children?.every((cell: any) =>
            cell.children?.[0]?.value?.trim().match(/^[-]+$/),
          );

          if (isSeparator) {
            // Create thead with header row
            const thead = {
              type: 'element',
              tagName: 'thead',
              properties: {},
              children: [headerRow],
            };

            // Convert header cells to th and apply alignment
            headerRow.children?.forEach((cell: any, index: number) => {
              cell.tagName = 'th';
              if (alignments[index]) {
                cell.properties = cell.properties || {};
                cell.properties.align = alignments[index];
              }
            });

            // Remove header and separator from tbody
            tbody.children.splice(0, 2);

            // Add thead to table
            element.children.unshift(thead);
          }
        }
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

  // Temporarily replace code blocks to avoid processing them during unified pipeline
  const codeBlocks: Array<{ original: string; lang: string }> = [];
  const exampleBlocks: Array<{ content: string }> = [];

  // First, replace all text blocks to preserve their inner content
  function findMatchingEnd(content: string, startIndex: number): number {
    let nestingLevel = 1;
    let searchIndex = startIndex;

    while (searchIndex < content.length && nestingLevel > 0) {
      const nextBegin = content.indexOf('#+begin_src', searchIndex);
      const nextEnd = content.indexOf('#+end_src', searchIndex);

      if (nextEnd === -1) return -1; // No matching end

      if (nextBegin !== -1 && nextBegin < nextEnd) {
        // Found nested begin_src
        nestingLevel++;
        searchIndex = nextBegin + '#+begin_src'.length;
      } else {
        // Found end_src
        nestingLevel--;
        if (nestingLevel === 0) {
          return nextEnd + '#+end_src'.length;
        }
        searchIndex = nextEnd + '#+end_src'.length;
      }
    }

    return -1; // No matching end found
  }

  function replaceTextBlocks(content: string): string {
    let result = content;

    while (true) {
      const beginIndex = result.indexOf('#+begin_src text', 0);
      if (beginIndex === -1) break;

      // Find the newline after begin_src text
      const newlineIndex = result.indexOf('\n', beginIndex);
      if (newlineIndex === -1) break;

      const endIndex = findMatchingEnd(result, newlineIndex + 1);
      if (endIndex === -1) break;

      const textBlock = result.substring(beginIndex, endIndex);
      console.log('textBlock:', JSON.stringify(textBlock));
      codeBlocks.push({ original: textBlock, lang: 'text' });
      const marker = `CODEBLOCKMARKER${codeBlocks.length - 1}`;

      result =
        result.substring(0, beginIndex) + marker + result.substring(endIndex);
    }

    return result;
  }

  orgContent = replaceTextBlocks(orgContent);

  // Then handle other code blocks with recursion
  function replaceCodeBlocks(content: string): string {
    return content.replace(
      /#\+begin_src(?:\s+(\w+))?\s*\n([\s\S]*?)#\+end_src/g,
      (match, lang, innerContent) => {
        const processedInner = replaceCodeBlocks(innerContent);
        const newMatch = match.replace(innerContent, processedInner);
        codeBlocks.push({ original: newMatch, lang: lang || '' });
        return `CODEBLOCKMARKER${codeBlocks.length - 1}`;
      },
    );
  }
  orgContent = replaceCodeBlocks(orgContent);

  // Handle example blocks
  orgContent = orgContent.replace(
    /#\+begin_example\s*\n([\s\S]*?)#\+end_example/g,
    (match, content) => {
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
    (match: string, type: string, content: string) => {
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

  // Convert using direct AST pipeline (inspired by org2mdx)
  const processor = unified()
    .use(parse)
    .use(orgCaptions)
    .use(orgTableAlignment)
    .use(uniorg2rehype)
    .use(rehypeCaptionsAndTableAlignment)
    .use(convertFiguresToHtml)
    .use(rehype2remark)
    .use(remarkGfm)
    .use(remarkStringify);

  const file = processor.processSync(orgContent);
  let markdown = String(file).trim();

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

  // Restore code blocks, converting org code blocks to markdown
  const restoreCodeBlock = (blockInfo: {
    original: string;
    lang: string;
  }): string => {
    const { original, lang } = blockInfo;
    const isTextBlock = lang === 'text';

    if (isTextBlock) {
      // For text blocks, extract content between begin and end markers
      const beginMarker = '#+begin_src text\n';
      const endMarker = '\n#+end_src';
      const beginIndex = original.indexOf(beginMarker);
      const endIndex = original.lastIndexOf(endMarker);

      if (beginIndex !== -1 && endIndex !== -1 && endIndex > beginIndex) {
        const content = original.substring(
          beginIndex + beginMarker.length,
          endIndex,
        );
        // Remove leading/trailing newlines but preserve indentation
        const trimmedContent = content.replace(/^\n+/, '').replace(/\n+$/, '');
        return `\`\`\`text\n${trimmedContent}\n\`\`\``;
      }
      return original; // fallback
    } else {
      // Convert org code block to markdown, recursively restoring inner blocks
      let result = original.replace(
        /#\+begin_src(?:\s+(\w+))?\s*\n([\s\S]*?)#\+end_src/g,
        (match: string, blockLang: string, content: string) => {
          // Restore any markers in content first
          const restoredContent = content.replace(
            /CODEBLOCKMARKER(\d+)/g,
            (markerMatch: string, markerIndex: string) => {
              return restoreCodeBlock(codeBlocks[parseInt(markerIndex)]);
            },
          );
          // Remove leading/trailing newlines but preserve indentation
          const trimmedContent = restoredContent
            .replace(/^\n+/, '')
            .replace(/\n+$/, '');
          const language = blockLang || '';
          return `\`\`\`${language}\n${trimmedContent}\n\`\`\``;
        },
      );
      return result;
    }
  };

  markdown = markdown.replace(
    /CODEBLOCKMARKER(\d+)/g,
    (match: string, index: string) => {
      return restoreCodeBlock(codeBlocks[parseInt(index)]);
    },
  );

  // Restore example blocks
  markdown = markdown.replace(/EXAMPLEBLOCKMARKER(\d+)/g, (match, index) => {
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
