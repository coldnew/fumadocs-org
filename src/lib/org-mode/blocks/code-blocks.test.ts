import { describe, it, expect } from 'vitest';
import { processCodeBlocks, restoreCodeBlocks } from './code-blocks';
import type { BlockContext } from './types';

describe('processCodeBlocks', () => {
  it('should process basic code blocks', () => {
    const content = `#+begin_src javascript
console.log("hello");
#+end_src`;

    const context: BlockContext = {
      codeBlocks: [],
      latexBlocks: [],
      htmlBlocks: [],
      jsxBlocks: [],
      exportHtmlBlocks: [],
      exportBlocks: [],
      calloutBlocks: [],
      exampleBlocks: [],
    };

    const result = processCodeBlocks(content, context);

    expect(result).toBe('CODEBLOCKMARKER0');
    expect(context.codeBlocks).toHaveLength(1);
    expect(context.codeBlocks[0]).toEqual({
      original: content,
      lang: 'javascript',
    });
  });

  it('should process code blocks without language', () => {
    const content = `#+begin_src
some code
#+end_src`;

    const context: BlockContext = {
      codeBlocks: [],
      latexBlocks: [],
      htmlBlocks: [],
      jsxBlocks: [],
      exportHtmlBlocks: [],
      exportBlocks: [],
      calloutBlocks: [],
      exampleBlocks: [],
    };

    const result = processCodeBlocks(content, context);

    expect(result).toBe('CODEBLOCKMARKER0');
    expect(context.codeBlocks[0]).toEqual({
      original: content,
      lang: '',
    });
  });

  it('should process text blocks', () => {
    const content = `#+begin_src text
This is text content
#+end_src`;

    const context: BlockContext = {
      codeBlocks: [],
      latexBlocks: [],
      htmlBlocks: [],
      jsxBlocks: [],
      exportHtmlBlocks: [],
      exportBlocks: [],
      calloutBlocks: [],
      exampleBlocks: [],
    };

    const result = processCodeBlocks(content, context);

    expect(result).toBe('CODEBLOCKMARKER0');
    expect(context.codeBlocks[0]).toEqual({
      original: content,
      lang: 'text',
    });
  });

  it('should process org blocks', () => {
    const content = `#+begin_src org
* Heading
Some content
#+end_src`;

    const context: BlockContext = {
      codeBlocks: [],
      latexBlocks: [],
      htmlBlocks: [],
      jsxBlocks: [],
      exportHtmlBlocks: [],
      exportBlocks: [],
      calloutBlocks: [],
      exampleBlocks: [],
    };

    const result = processCodeBlocks(content, context);

    expect(result).toBe('CODEBLOCKMARKER0');
    expect(context.codeBlocks[0]).toEqual({
      original: content,
      lang: 'org',
    });
  });

  it('should handle multiple code blocks', () => {
    const content = `#+begin_src javascript
console.log("first");
#+end_src

#+begin_src python
print("second")
#+end_src`;

    const context: BlockContext = {
      codeBlocks: [],
      latexBlocks: [],
      htmlBlocks: [],
      jsxBlocks: [],
      exportHtmlBlocks: [],
      exportBlocks: [],
      calloutBlocks: [],
      exampleBlocks: [],
    };

    const result = processCodeBlocks(content, context);

    expect(result).toBe(`CODEBLOCKMARKER0

CODEBLOCKMARKER1`);
    expect(context.codeBlocks).toHaveLength(2);
    expect(context.codeBlocks[0].lang).toBe('javascript');
    expect(context.codeBlocks[1].lang).toBe('python');
  });

  it('should handle nested code blocks', () => {
    const content = `#+begin_src text
Outer text block
#+begin_src javascript
console.log("nested");
#+end_src
End of outer block
#+end_src`;

    const context: BlockContext = {
      codeBlocks: [],
      latexBlocks: [],
      htmlBlocks: [],
      jsxBlocks: [],
      exportHtmlBlocks: [],
      exportBlocks: [],
      calloutBlocks: [],
      exampleBlocks: [],
    };

    const result = processCodeBlocks(content, context);

    expect(result).toBe('CODEBLOCKMARKER0');
    expect(context.codeBlocks).toHaveLength(1);
    expect(context.codeBlocks[0].lang).toBe('text');
  });

  it('should preserve content outside code blocks', () => {
    const content = `Some text before

#+begin_src javascript
code here
#+end_src

Some text after`;

    const context: BlockContext = {
      codeBlocks: [],
      latexBlocks: [],
      htmlBlocks: [],
      jsxBlocks: [],
      exportHtmlBlocks: [],
      exportBlocks: [],
      calloutBlocks: [],
      exampleBlocks: [],
    };

    const result = processCodeBlocks(content, context);

    expect(result).toBe(`Some text before

CODEBLOCKMARKER0

Some text after`);
  });
});

describe('restoreCodeBlocks', () => {
  it('should restore basic code blocks', () => {
    const context: BlockContext = {
      codeBlocks: [
        {
          original: `#+begin_src javascript
console.log("hello");
#+end_src`,
          lang: 'javascript',
        },
      ],
      latexBlocks: [],
      htmlBlocks: [],
      jsxBlocks: [],
      exportHtmlBlocks: [],
      exportBlocks: [],
      calloutBlocks: [],
      exampleBlocks: [],
    };

    const markdown = 'CODEBLOCKMARKER0';
    const result = restoreCodeBlocks(markdown, context);

    expect(result).toBe(`\`\`\`javascript
console.log("hello");
\`\`\``);
  });

  it('should restore code blocks without language', () => {
    const context: BlockContext = {
      codeBlocks: [
        {
          original: `#+begin_src
some code
#+end_src`,
          lang: '',
        },
      ],
      latexBlocks: [],
      htmlBlocks: [],
      jsxBlocks: [],
      exportHtmlBlocks: [],
      exportBlocks: [],
      calloutBlocks: [],
      exampleBlocks: [],
    };

    const markdown = 'CODEBLOCKMARKER0';
    const result = restoreCodeBlocks(markdown, context);

    expect(result).toBe(`\`\`\`
some code
\`\`\``);
  });

  it('should restore text blocks', () => {
    const context: BlockContext = {
      codeBlocks: [
        {
          original: `#+begin_src text
This is text content
#+end_src`,
          lang: 'text',
        },
      ],
      latexBlocks: [],
      htmlBlocks: [],
      jsxBlocks: [],
      exportHtmlBlocks: [],
      exportBlocks: [],
      calloutBlocks: [],
      exampleBlocks: [],
    };

    const markdown = 'CODEBLOCKMARKER0';
    const result = restoreCodeBlocks(markdown, context);

    expect(result).toBe(`\`\`\`text
This is text content
\`\`\``);
  });

  it('should restore org blocks as text', () => {
    const context: BlockContext = {
      codeBlocks: [
        {
          original: `#+begin_src org
* Heading
Some content
#+end_src`,
          lang: 'org',
        },
      ],
      latexBlocks: [],
      htmlBlocks: [],
      jsxBlocks: [],
      exportHtmlBlocks: [],
      exportBlocks: [],
      calloutBlocks: [],
      exampleBlocks: [],
    };

    const markdown = 'CODEBLOCKMARKER0';
    const result = restoreCodeBlocks(markdown, context);

    expect(result).toBe(`\`\`\`text
* Heading
Some content
\`\`\``);
  });

  it('should map math language to latex', () => {
    const context: BlockContext = {
      codeBlocks: [
        {
          original: `#+begin_src math
E = mc^2
#+end_src`,
          lang: 'math',
        },
      ],
      latexBlocks: [],
      htmlBlocks: [],
      jsxBlocks: [],
      exportHtmlBlocks: [],
      exportBlocks: [],
      calloutBlocks: [],
      exampleBlocks: [],
    };

    const markdown = 'CODEBLOCKMARKER0';
    const result = restoreCodeBlocks(markdown, context);

    expect(result).toBe(`\`\`\`latex
E = mc^2
\`\`\``);
  });

  it('should handle multiple markers', () => {
    const context: BlockContext = {
      codeBlocks: [
        {
          original: `#+begin_src javascript
first block
#+end_src`,
          lang: 'javascript',
        },
        {
          original: `#+begin_src python
second block
#+end_src`,
          lang: 'python',
        },
      ],
      latexBlocks: [],
      htmlBlocks: [],
      jsxBlocks: [],
      exportHtmlBlocks: [],
      exportBlocks: [],
      calloutBlocks: [],
      exampleBlocks: [],
    };

    const markdown = `CODEBLOCKMARKER0

CODEBLOCKMARKER1`;
    const result = restoreCodeBlocks(markdown, context);

    expect(result).toBe(`\`\`\`javascript
first block
\`\`\`

\`\`\`python
second block
\`\`\``);
  });

  it('should handle nested code blocks in content', () => {
    const context: BlockContext = {
      codeBlocks: [
        {
          original: `#+begin_src javascript
inner code
#+end_src`,
          lang: 'javascript',
        },
        {
          original: `#+begin_src text
Outer block
CODEBLOCKMARKER0
End outer
#+end_src`,
          lang: 'text',
        },
      ],
      latexBlocks: [],
      htmlBlocks: [],
      jsxBlocks: [],
      exportHtmlBlocks: [],
      exportBlocks: [],
      calloutBlocks: [],
      exampleBlocks: [],
    };

    const markdown = 'CODEBLOCKMARKER1';
    const result = restoreCodeBlocks(markdown, context);

    expect(result).toBe(`\`\`\`text
Outer block
CODEBLOCKMARKER0
End outer
\`\`\``);
  });

  it('should return empty string for invalid markers', () => {
    const context: BlockContext = {
      codeBlocks: [],
      latexBlocks: [],
      htmlBlocks: [],
      jsxBlocks: [],
      exportHtmlBlocks: [],
      exportBlocks: [],
      calloutBlocks: [],
      exampleBlocks: [],
    };

    const markdown = 'CODEBLOCKMARKER0';
    const result = restoreCodeBlocks(markdown, context);

    expect(result).toBe('');
  });
});
