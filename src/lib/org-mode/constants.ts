/**
 * Constants and regex patterns used throughout the org-mode library
 */

// Marker strings for temporary content replacement
export const MARKERS = {
  CODE_BLOCK: 'CODEBLOCKMARKER',
  EXAMPLE_BLOCK: 'EXAMPLEBLOCKMARKER',
  HTML_BLOCK: 'HTMLMARKER',
  EXPORT_HTML_BLOCK: 'EXPORTHTMLMARKER',
  EXPORT_BLOCK: 'EXPORTBLOCKMARKER',
  JSX_BLOCK: 'JSXMARKER',
  LATEX_BLOCK: 'LATEXMARKER',
  CALLOUT_BLOCK: 'CALLOUTMARKER',
} as const;

// Regex patterns for org-mode parsing
export const PATTERNS = {
  // Keywords: #+KEY: value
  KEYWORD: /^#\+(\w+):\s*(.*)$/gm,

  // Code blocks: #+begin_src lang ... #+end_src
  CODE_BLOCK: /#\+begin_src(?:[ \t]+(\w+)(.*)?)?[ \t]*\n([\s\S]*?)#\+end_src/gi,

  // LaTeX blocks: #+begin_latex ... #+end_latex
  LATEX_BLOCK: /#\+begin_latex[ \t]*\n([\s\S]*?)#\+end_latex/g,

  // HTML blocks: #+HTML: content
  HTML_BLOCK: /^#\+html:\s*(.+)$/gim,

  // JSX blocks: #+JSX: content
  JSX_BLOCK: /^#\+jsx:\s*(.+)$/gim,

  // Export blocks: #+begin_export type ... #+end_export
  EXPORT_BLOCK: /#\+begin_export (\w+)(.*)?[ \t]*\n([\s\S]*?)#\+end_export/g,

  // Export HTML blocks: #+begin_export html ... #+end_export
  EXPORT_HTML_BLOCK:
    /#\+begin_export html(.*)?[ \t]*\n([\s\S]*?)#\+end_export/g,

  // Callout blocks: #+begin_type ... #+end_type
  CALLOUT_BLOCK: /#\+begin_(\w+)\s*\n([\s\S]*?)#\+end_\1/g,

  // Example blocks: #+begin_example ... #+end_example
  EXAMPLE_BLOCK: /#\+begin_example\s*\n([\s\S]*?)#\+end_example/g,

  // Comment blocks: #+begin_comment ... #+end_comment
  COMMENT_BLOCK: /#\+begin_comment\s*\n([\s\S]*?)#\+end_comment/g,

  // Checkboxes in lists: - [X] text, - [ ] text, - [-] text
  CHECKBOX_ITEM: /^(\s*)- \[([ X-])\] (.+)$/gm,

  // Table alignment markers: <l>, <c>, <r>
  TABLE_ALIGNMENT: /^(\s*)\|(.+)\|\s*$/gm,
} as const;

// Keywords to skip during extraction (cause issues or are not useful)
export const SKIP_KEYWORDS = new Set(['options', 'latex_header', 'date']);

// Callout type mappings from org-mode to Fumadocs
export const CALLOUT_TYPE_MAP: Record<string, string> = {
  warning: 'warning',
  error: 'error',
  info: 'info',
  note: 'note',
  tip: 'tip',
  caution: 'caution',
};

// Language mappings for syntax highlighting
export const LANGUAGE_MAPPINGS: Record<string, string> = {
  math: 'latex', // Map math blocks to LaTeX highlighting
};

// File extensions for different content types
export const FILE_EXTENSIONS = {
  ORG: '.org',
  MDX: '.mdx',
  MD5: '.md5sum',
} as const;

// Default frontmatter values
export const DEFAULT_FRONTMATTER = {
  TITLE: 'Generated from Org-mode',
  DESCRIPTION: 'Generated from Org-mode',
} as const;
