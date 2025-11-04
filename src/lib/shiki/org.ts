import type { LanguageRegistration } from 'shiki';

// Org-mode grammar definition for Shiki
const orgGrammar = {
  $schema:
    'https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json',
  name: 'Org Markup',
  patterns: [
    {
      name: 'markup.heading.org',
      begin: '^\\s*[*]{1}\\s+',
      end: '$',
      patterns: [
        {
          include: '#header-matches',
        },
      ],
    },
    {
      name: 'entity.name.type.org',
      begin: '^\\s*[*]{2}\\s+',
      end: '$',
      patterns: [
        {
          include: '#header-matches',
        },
      ],
    },
    {
      name: 'entity.name.function.org',
      begin: '^\\s*[*]{3}\\s+',
      end: '$',
      patterns: [
        {
          include: '#header-matches',
        },
      ],
    },
    {
      name: 'entity.other.attribute-name.org',
      begin: '^\\s*[*]{4}\\s+',
      end: '$',
      patterns: [
        {
          include: '#header-matches',
        },
      ],
    },
    {
      include: '#common',
    },
    {
      include: '#src-blocks',
    },
    {
      include: '#blocks',
    },
  ],
  repository: {
    'src-blocks': {
      patterns: [
        {
          name: 'meta.block.source.js.org',
          begin:
            '(?i)(?:^|\\G)(?:\\s*)(#\\+BEGIN_SRC)\\s+(js|javascript|mjs|es6|jsx)\\b\\s*(.*)$',
          end: '(?i)(?:^|\\G)(?:\\s*)(#\\+END_SRC)\\s*$',
          beginCaptures: {
            '1': {
              name: 'keyword.control.block.org',
            },
            '2': {
              name: 'constant.other.language.org',
            },
            '3': {
              name: 'string.other.header-args.org',
            },
          },
          endCaptures: {
            '1': {
              name: 'keyword.control.block.org',
            },
          },
          patterns: [
            {
              begin: '(^|\\G)(\\s*)(.*)',
              while: '(?i)(^|\\G)(?!\\s*#\\+END_SRC\\s*)',
              contentName: 'meta.embedded.block.js',
              patterns: [
                {
                  include: 'source.js',
                },
              ],
            },
          ],
        },
        {
          name: 'meta.block.source.js.regexp.org',
          begin:
            '(?i)(?:^|\\G)(?:\\s*)(#\\+BEGIN_SRC)\\s+(js.regexp|regexp)\\b\\s*(.*)$',
          end: '(?i)(?:^|\\G)(?:\\s*)(#\\+END_SRC)\\s*$',
          beginCaptures: {
            '1': {
              name: 'keyword.control.block.org',
            },
            '2': {
              name: 'constant.other.language.org',
            },
            '3': {
              name: 'string.other.header-args.org',
            },
          },
          endCaptures: {
            '1': {
              name: 'keyword.control.block.org',
            },
          },
          patterns: [
            {
              begin: '(^|\\G)(\\s*)(.*)',
              while: '(?i)(^|\\G)(?!\\s*#\\+END_SRC\\s*)',
              contentName: 'meta.embedded.block.js.regexp',
              patterns: [
                {
                  include: 'source.js.regexp',
                },
              ],
            },
          ],
        },
        {
          name: 'meta.block.source.ts.org',
          begin:
            '(?i)(?:^|\\G)(?:\\s*)(#\\+BEGIN_SRC)\\s+(ts|typescript)\\b\\s*(.*)$',
          end: '(?i)(?:^|\\G)(?:\\s*)(#\\+END_SRC)\\s*$',
          beginCaptures: {
            '1': {
              name: 'keyword.control.block.org',
            },
            '2': {
              name: 'constant.other.language.org',
            },
            '3': {
              name: 'string.other.header-args.org',
            },
          },
          endCaptures: {
            '1': {
              name: 'keyword.control.block.org',
            },
          },
          patterns: [
            {
              begin: '(^|\\G)(\\s*)(.*)',
              while: '(?i)(^|\\G)(?!\\s*#\\+END_SRC\\s*)',
              contentName: 'meta.embedded.block.ts',
              patterns: [
                {
                  include: 'source.ts',
                },
              ],
            },
          ],
        },
        {
          name: 'meta.block.source.tsx.org',
          begin: '(?i)(?:^|\\G)(?:\\s*)(#\\+BEGIN_SRC)\\s+(tsx)\\b\\s*(.*)$',
          end: '(?i)(?:^|\\G)(?:\\s*)(#\\+END_SRC)\\s*$',
          beginCaptures: {
            '1': {
              name: 'keyword.control.block.org',
            },
            '2': {
              name: 'constant.other.language.org',
            },
            '3': {
              name: 'string.other.header-args.org',
            },
          },
          endCaptures: {
            '1': {
              name: 'keyword.control.block.org',
            },
          },
          patterns: [
            {
              begin: '(^|\\G)(\\s*)(.*)',
              while: '(?i)(^|\\G)(?!\\s*#\\+END_SRC\\s*)',
              contentName: 'meta.embedded.block.tsx',
              patterns: [
                {
                  include: 'source.tsx',
                },
              ],
            },
          ],
        },
        {
          name: 'meta.block.source.java.org',
          begin: '(?i)(?:^|\\G)(?:\\s*)(#\\+BEGIN_SRC)\\s+(java)\\b\\s*(.*)$',
          end: '(?i)(?:^|\\G)(?:\\s*)(#\\+END_SRC)\\s*$',
          beginCaptures: {
            '1': {
              name: 'keyword.control.block.org',
            },
            '2': {
              name: 'constant.other.language.org',
            },
            '3': {
              name: 'string.other.header-args.org',
            },
          },
          endCaptures: {
            '1': {
              name: 'keyword.control.block.org',
            },
          },
          patterns: [
            {
              begin: '(^|\\G)(\\s*)(.*)',
              while: '(?i)(^|\\G)(?!\\s*#\\+END_SRC\\s*)',
              contentName: 'meta.embedded.block.java',
              patterns: [
                {
                  include: 'source.java',
                },
              ],
            },
          ],
        },
        {
          name: 'meta.block.source.python.org',
          begin:
            '(?i)(?:^|\\G)(?:\\s*)(#\\+BEGIN_SRC)\\s+(python|py|py3|rpy|pyw|cpy|SConstruct|Sconstruct|sconstruct|SConscript|gyp|gypi)\\b\\s*(.*)$',
          end: '(?i)(?:^|\\G)(?:\\s*)(#\\+END_SRC)\\s*$',
          beginCaptures: {
            '1': {
              name: 'keyword.control.block.org',
            },
            '2': {
              name: 'constant.other.language.org',
            },
            '3': {
              name: 'string.other.header-args.org',
            },
          },
          endCaptures: {
            '1': {
              name: 'keyword.control.block.org',
            },
          },
          patterns: [
            {
              begin: '(^|\\G)(\\s*)(.*)',
              while: '(?i)(^|\\G)(?!\\s*#\\+END_SRC\\s*)',
              contentName: 'meta.embedded.block.python',
              patterns: [
                {
                  include: 'source.python',
                },
              ],
            },
          ],
        },
        {
          name: 'meta.block.source.css.org',
          begin: '(?i)(?:^|\\G)(?:\\s*)(#\\+BEGIN_SRC)\\s+(css)\\b\\s*(.*)$',
          end: '(?i)(?:^|\\G)(?:\\s*)(#\\+END_SRC)\\s*$',
          beginCaptures: {
            '1': {
              name: 'keyword.control.block.org',
            },
            '2': {
              name: 'constant.other.language.org',
            },
            '3': {
              name: 'string.other.header-args.org',
            },
          },
          endCaptures: {
            '1': {
              name: 'keyword.control.block.org',
            },
          },
          patterns: [
            {
              begin: '(^|\\G)(\\s*)(.*)',
              while: '(?i)(^|\\G)(?!\\s*#\\+END_SRC\\s*)',
              contentName: 'meta.embedded.block.css',
              patterns: [
                {
                  include: 'source.css',
                },
              ],
            },
          ],
        },
        {
          name: 'meta.block.source.clojure.org',
          begin:
            '(?i)(?:^|\\G)(?:\\s*)(#\\+BEGIN_SRC)\\s+(clojure|clj|cljs)\\b\\s*(.*)$',
          end: '(?i)(?:^|\\G)(?:\\s*)(#\\+END_SRC)\\s*$',
          beginCaptures: {
            '1': {
              name: 'keyword.control.block.org',
            },
            '2': {
              name: 'constant.other.language.org',
            },
            '3': {
              name: 'string.other.header-args.org',
            },
          },
          endCaptures: {
            '1': {
              name: 'keyword.control.block.org',
            },
          },
          patterns: [
            {
              begin: '(^|\\G)(\\s*)(.*)',
              while: '(?i)(^|\\G)(?!\\s*#\\+END_SRC\\s*)',
              contentName: 'meta.embedded.block.clojure',
              patterns: [
                {
                  include: 'source.clojure',
                },
              ],
            },
          ],
        },
        {
          name: 'meta.block.source.cpp.org',
          begin:
            '(?i)(?:^|\\G)(?:\\s*)(#\\+BEGIN_SRC)\\s+(cpp|c\\+\\+|cxx)\\b\\s*(.*)$',
          end: '(?i)(?:^|\\G)(?:\\s*)(#\\+END_SRC)\\s*$',
          beginCaptures: {
            '1': {
              name: 'keyword.control.block.org',
            },
            '2': {
              name: 'constant.other.language.org',
            },
            '3': {
              name: 'string.other.header-args.org',
            },
          },
          endCaptures: {
            '1': {
              name: 'keyword.control.block.org',
            },
          },
          patterns: [
            {
              begin: '(^|\\G)(\\s*)(.*)',
              while: '(?i)(^|\\G)(?!\\s*#\\+END_SRC\\s*)',
              contentName: 'meta.embedded.block.cpp',
              patterns: [
                {
                  include: 'source.cpp',
                },
              ],
            },
          ],
        },
        {
          name: 'meta.block.source.c.org',
          begin: '(?i)(?:^|\\G)(?:\\s*)(#\\+BEGIN_SRC)\\s+(c|h)\\b\\s*(.*)$',
          end: '(?i)(?:^|\\G)(?:\\s*)(#\\+END_SRC)\\s*$',
          beginCaptures: {
            '1': {
              name: 'keyword.control.block.org',
            },
            '2': {
              name: 'constant.other.language.org',
            },
            '3': {
              name: 'string.other.header-args.org',
            },
          },
          endCaptures: {
            '1': {
              name: 'keyword.control.block.org',
            },
          },
          patterns: [
            {
              begin: '(^|\\G)(\\s*)(.*)',
              while: '(?i)(^|\\G)(?!\\s*#\\+END_SRC\\s*)',
              contentName: 'meta.embedded.block.c',
              patterns: [
                {
                  include: 'source.c',
                },
              ],
            },
          ],
        },
        {
          name: 'meta.block.source.org',
          begin: '(?i)(?:^|\\G)(?:\\s*)(#\\+BEGIN_SRC)\\s+(org)\\b\\s*(.*)$',
          end: '(?i)(?:^|\\G)(?:\\s*)(#\\+END_SRC)\\s*$',
          beginCaptures: {
            '1': {
              name: 'keyword.control.block.org',
            },
            '2': {
              name: 'constant.other.language.org',
            },
            '3': {
              name: 'string.other.header-args.org',
            },
          },
          endCaptures: {
            '1': {
              name: 'keyword.control.block.org',
            },
          },
          patterns: [
            {
              begin: '(^|\\G)(\\s*)(.*)',
              while: '(?i)(^|\\G)(?!\\s*#\\+END_SRC\\s*)',
              contentName: 'meta.embedded.block.org',
              patterns: [
                {
                  include: 'source.org',
                },
              ],
            },
          ],
        },
        {
          name: 'meta.block.source.text.org',
          begin:
            '(?i)(?:^|\\G)(?:\\s*)(#\\+BEGIN_SRC)\\s+([^\\s]+)\\b\\s*(.*)$',
          end: '(?i)(?:^|\\G)(?:\\s*)(#\\+END_SRC)\\s*$',
          beginCaptures: {
            '1': {
              name: 'keyword.control.block.org',
            },
            '2': {
              name: 'constant.other.language.org',
            },
            '3': {
              name: 'string.other.header-args.org',
            },
          },
          endCaptures: {
            '1': {
              name: 'keyword.control.block.org',
            },
          },
        },
      ],
    },
    blocks: {
      patterns: [
        {
          name: 'meta.block.quote.org',
          begin: '^\\s*#\\+BEGIN_QUOTE\\s*$',
          end: '^\\s*#\\+END_QUOTE\\s*$',
          beginCaptures: {
            '0': {
              name: 'keyword.control.block.org',
            },
          },
          endCaptures: {
            '0': {
              name: 'keyword.control.block.org',
            },
          },
        },
        {
          name: 'meta.block.example.org',
          begin: '^\\s*#\\+BEGIN_EXAMPLE\\s*$',
          end: '^\\s*#\\+END_EXAMPLE\\s*$',
          beginCaptures: {
            '0': {
              name: 'keyword.control.block.org',
            },
          },
          endCaptures: {
            '0': {
              name: 'keyword.control.block.org',
            },
          },
        },
        {
          name: 'meta.block.export.org',
          begin: '^\\s*#\\+BEGIN_EXPORT\\s+\\w+\\s*$',
          end: '^\\s*#\\+END_EXPORT\\s*$',
          beginCaptures: {
            '0': {
              name: 'keyword.control.block.org',
            },
          },
          endCaptures: {
            '0': {
              name: 'keyword.control.block.org',
            },
          },
        },
      ],
    },
    common: {
      patterns: [
        {
          include: '#timestamp',
        },
        {
          include: '#link',
        },
        {
          include: '#bold',
        },
        {
          include: '#italic',
        },
        {
          include: '#underline',
        },
        {
          include: '#literal',
        },
        {
          include: '#code',
        },
        {
          include: '#verbatim',
        },
        {
          include: '#comment',
        },
        {
          include: '#keywords',
        },
      ],
    },
    'header-matches': {
      patterns: [
        {
          include: '#common',
        },
        {
          include: '#todo',
        },
        {
          include: '#done',
        },
        {
          include: '#userKeywords',
        },
      ],
    },
    timestamp: {
      patterns: [
        {
          name: 'variable.org',
          match: '\\[\\d{4}-\\d{1,2}-\\d{1,2}(?: \\w{3})?\\]',
        },
      ],
    },
    link: {
      patterns: [
        {
          name: 'meta.link.inline.org',
          match: '(\\[\\[)([^\\[\\]]+)(\\])(?:(\\[)([^\\[\\]]+)(\\]))?(\\])',
          captures: {
            '1': {
              name: 'punctuation.definition.string.begin.org',
            },
            '2': {
              name: 'markup.underline.link.org',
            },
            '3': {
              name: 'punctuation.definition.string.end.org',
            },
            '4': {
              name: 'punctuation.definition.string.begin.org',
            },
            '5': {
              name: 'string.other.link.title.org',
            },
            '6': {
              name: 'punctuation.definition.string.end.org',
            },
            '7': {
              name: 'punctuation.definition.string.end.org',
            },
            '8': {
              name: 'punctuation.definition.string.end.org',
            },
          },
        },
      ],
    },
    todo: {
      patterns: [
        {
          name: 'invalid.illegal.org',
          match: '\\bTODO\\b',
        },
      ],
    },
    done: {
      patterns: [
        {
          name: 'keyword.control.org',
          match: '\\bDONE\\b',
        },
      ],
    },
    userKeywords: {
      patterns: [
        {
          name: 'string.quoted.double.org',
          match: '\\b([A-Z]{3,})\\b',
        },
      ],
    },
    bold: {
      patterns: [
        {
          name: 'markup.bold.org',
          match: '(^|\\s)\\*[^\\s](.*?[^\\s])?\\*($|\\W)',
        },
      ],
    },
    italic: {
      patterns: [
        {
          name: 'markup.italic.org',
          match: '(^|\\s)/[^\\s](.*?[^\\s])?/($|\\W)',
        },
      ],
    },
    underline: {
      patterns: [
        {
          name: 'markup.underline.org',
          match: '(^|\\s)\\_[^\\s](.*?[^\\s])?\\_($|\\W)',
        },
      ],
    },
    literal: {
      patterns: [
        {
          name: 'markup.italic.org',
          match: '^:.+',
        },
      ],
    },
    code: {
      patterns: [
        {
          name: 'variable.org',
          match: '(^|\\s)\\~[^\\s](.*?[^\\s])?\\~($|\\W)',
        },
      ],
    },
    verbatim: {
      patterns: [
        {
          name: 'variable.org',
          match: '(^|\\s)\\=[^\\s](.*?[^\\s])?\\=($|\\W)',
        },
      ],
    },
    comment: {
      patterns: [
        {
          match: '(^|\\s)(#)\\s(.*)$',
          captures: {
            '2': {
              name: 'punctuation.definition.comment',
            },
            '3': {
              name: 'comment.line',
            },
          },
        },
      ],
    },
    keywords: {
      patterns: [
        {
          match: '^(#\\+\\w+:)\\s(.*)$',
          captures: {
            '1': {
              name: 'support.type.property-name.org',
            },
            '2': {
              name: 'meta.structure.dictionary.value.org',
            },
          },
        },
      ],
    },
  },
  scopeName: 'source.org',
};

export const orgLanguage: LanguageRegistration = {
  name: 'org',
  scopeName: orgGrammar.scopeName,
  aliases: ['org-mode', 'orgmode'] as string[],
  patterns: orgGrammar.patterns,
  repository: orgGrammar.repository,
};
