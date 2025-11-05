import type {
  CodeBlock,
  LatexBlock,
  HtmlBlock,
  JsxBlock,
  ExportHtmlBlock,
  ExportBlock,
  CalloutBlock,
  ExampleBlock,
} from '@/lib/org-mode/types';

/**
 * Block processing context
 */
export interface BlockContext {
  codeBlocks: CodeBlock[];
  latexBlocks: LatexBlock[];
  htmlBlocks: HtmlBlock[];
  jsxBlocks: JsxBlock[];
  exportHtmlBlocks: ExportHtmlBlock[];
  exportBlocks: ExportBlock[];
  calloutBlocks: CalloutBlock[];
  exampleBlocks: ExampleBlock[];
}

/**
 * Block processor interface
 */
export interface BlockProcessor {
  process: (content: string, context: BlockContext) => string;
  restore: (markdown: string, context: BlockContext) => string;
}

/**
 * Block registry interface
 */
export interface BlockRegistry {
  [key: string]: BlockProcessor;
}
