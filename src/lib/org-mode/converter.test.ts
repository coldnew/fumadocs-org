import { describe, it, expect } from 'vitest';
import {
  convertOrgToMdx,
  extractOrgKeywords,
  getCalloutTypeFromOrgType,
} from './converter';

describe('convertOrgToMdx', () => {
  it('should convert basic Org content to MDX', async () => {
    const orgContent = `* Hello World

This is a test.`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.frontmatter).toContain('title: Test');
    expect(result.markdown).toContain('# Hello World');
    expect(result.markdown).toContain('This is a test.');
  });

  it('should extract TITLE keyword', async () => {
    const orgContent = `#+TITLE: Custom Title

Content here.`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.frontmatter).toContain('title: Custom Title');
  });

  it('should include multiple keywords in frontmatter', async () => {
    const orgContent = `#+TITLE: Test Document
#+AUTHOR: Test Author
#+DESCRIPTION: A test document

Some content.`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.frontmatter).toContain('title: Test Document');
    expect(result.frontmatter).toContain('author: Test Author');
    expect(result.frontmatter).toContain('description: A test document');
  });

  it('should convert Org headings to Markdown', async () => {
    const orgContent = `* Level 1
** Level 2
*** Level 3

Content under headings.`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.markdown).toContain('# Level 1');
    expect(result.markdown).toContain('## Level 2');
    expect(result.markdown).toContain('### Level 3');
  });

  it('should convert Org lists to Markdown', async () => {
    const orgContent = `- Item 1
- Item 2
  - Nested item

1. Numbered item 1
2. Numbered item 2`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.markdown).toContain('* Item 1');
    expect(result.markdown).toContain('* Item 2');
    expect(result.markdown).toContain('  * Nested item');
    // Note: Ordered lists are converted as unordered due to uniorg limitation
    expect(result.markdown).toContain('* Numbered item 1');
  });

  it('should preserve code blocks', async () => {
    const orgContent = `#+begin_src javascript
console.log('hello');
#+end_src`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.markdown).toContain('```javascript');
    expect(result.markdown).toContain("console.log('hello');");
    expect(result.markdown).toContain('```');
  });

  it('should convert Org tables to Markdown', async () => {
    const orgContent = `| Name    | Age | Occupation  |
|---------+-----+-------------|
| Alice   |  25 | Engineer    |
| Bob     |  30 | Designer    |`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.markdown).toContain('| Name  | Age | Occupation |');
    expect(result.markdown).toContain('| ----- | --- | ---------- |');
    expect(result.markdown).toContain('| Alice | 25  | Engineer   |');
    expect(result.markdown).toContain('| Bob   | 30  | Designer   |');
  });

  it('should convert links', async () => {
    const orgContent = `Visit [[https://example.com][Example Site]] for more info.`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.markdown).toContain('[Example Site](https://example.com)');
  });

  it('should handle TODO keywords', async () => {
    const orgContent = `* DONE Completed task
* TODO Pending task`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.markdown).toContain('# DONE Completed task');
    expect(result.markdown).toContain('# TODO Pending task');
  });

  it('should convert Org math expressions to LaTeX', async () => {
    const orgContent = `Inline math: $E = mc^2$

Display math:
$$\int_0^1 f(x) \, dx$$

Complex formula:
$$\lim_{x \to 0} \frac{\sin x}{x} = 1$$`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.markdown).toContain('$E = mc^2$');
    expect(result.markdown).toContain('$$ int\\_0^1 f(x) , dx $$');
    expect(result.markdown).toContain('$$ lim\\_{x o 0} rac{sin x}{x} = 1 $$');
  });

  it('should convert Org callout blocks to Fumadocs Callouts', async () => {
    const orgContent = `#+begin_warning
This is a warning message.
#+end_warning

#+begin_note
This is an informational note.
#+end_note

#+begin_tip
Here's a helpful tip.
#+end_tip`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.markdown).toContain('<Callout type="warning">');
    expect(result.markdown).toContain('This is a warning message.');
    expect(result.markdown).toContain('</Callout>');

    expect(result.markdown).toContain('<Callout type="note">');
    expect(result.markdown).toContain('This is an informational note.');

    expect(result.markdown).toContain('<Callout type="tip">');
    expect(result.markdown).toContain("Here's a helpful tip.");
  });

  it('should preserve formatting inside callouts', async () => {
    const orgContent = `#+begin_warning
This is a *bold* message with /italic/ text and $math$ formula.
#+end_warning`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.markdown).toContain('<Callout type="warning">');
    expect(result.markdown).toContain('**bold**');
    expect(result.markdown).toContain('*italic*');
    expect(result.markdown).toContain('math');
    expect(result.markdown).toContain('</Callout>');
  });

  it('should handle empty content', async () => {
    const orgContent = ``;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.frontmatter).toContain('title: Test');
    expect(result.markdown.trim()).toBe('');
  });

  it('should handle malformed Org syntax gracefully', async () => {
    const orgContent = `* Unclosed heading

Some content without proper structure.`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.markdown).toContain('# Unclosed heading');
    expect(result.markdown).toContain('Some content without proper structure.');
  });

  it('should handle multiple callout types', async () => {
    const orgContent = `#+begin_warning
Warning content
#+end_warning

#+begin_error
Error content
#+end_error

#+begin_info
Info content
#+end_info`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.markdown).toContain('<Callout type="warning">');
    expect(result.markdown).toContain('<Callout type="error">');
    expect(result.markdown).toContain('<Callout type="info">');
  });

  it('should handle complex Org content with multiple features', async () => {
    const orgContent = `* Heading

Some paragraph with *bold* and /italic/ text.

- List item 1
- List item 2

| Table | Column |
|-------|--------|
| Data  | Here   |

[[https://example.com][Link]]`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.markdown).toContain('# Heading');
    expect(result.markdown).toContain('**bold**');
    expect(result.markdown).toContain('*italic*');
    expect(result.markdown).toContain('List item 1');
    expect(result.markdown).toContain('| Table | Column |');
    expect(result.markdown).toContain('[Link](https://example.com)');
  });

  it('should handle invalid Org syntax without crashing', async () => {
    const orgContent = `#+begin_invalid
Invalid block
#+end_invalid

* Incomplete heading`;

    const result = await convertOrgToMdx(orgContent, 'test');

    // Should not crash and produce some output
    expect(result.markdown).toBeDefined();
    expect(typeof result.markdown).toBe('string');
  });

  it('should handle nested lists', async () => {
    const orgContent = `- Item 1
  - Subitem 1.1
  - Subitem 1.2
- Item 2
  1. Numbered subitem 2.1
  2. Numbered subitem 2.2`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.markdown).toContain('Item 1');
    expect(result.markdown).toContain('Subitem 1.1');
    expect(result.markdown).toContain('Numbered subitem 2.1');
  });

  it('should handle code blocks with language', async () => {
    const orgContent = `#+begin_src javascript
function hello() {
  console.log("Hello World");
}
#+end_src`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.markdown).toContain('```javascript');
    expect(result.markdown).toContain('function hello()');
    expect(result.markdown).toContain('```');
  });

  it('should handle frontmatter with special characters', async () => {
    const orgContent = `#+TITLE: Title with "quotes" and 'apostrophes'
#+DESCRIPTION: Description with special chars: @#$%^&*()

Content here.`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.frontmatter).toContain(
      'title: Title with "quotes" and \'apostrophes\'',
    );
    expect(result.frontmatter).toContain(
      "description: 'Description with special chars: @#$%^&*()'",
    );
  });

  it('should handle code blocks with syntax highlighting', async () => {
    const orgContent = `#+begin_src javascript
function hello() {
  console.log("Hello World");
}
#+end_src`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.markdown).toContain('```javascript');
    expect(result.markdown).toContain('function hello()');
    expect(result.markdown).toContain('```');
  });

  it('should preserve indentation in code blocks containing org syntax', async () => {
    const orgContent = `#+begin_src text
  #+begin_warning
  This is indented content.
  #+end_warning
#+end_src`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.markdown).toContain(
      '```text\n  #+begin_warning\n  This is indented content.\n  #+end_warning\n```',
    );
    // Ensure callouts inside code blocks are not converted
    expect(result.markdown).not.toContain('<Callout type="warning">');
  });

  it('should preserve blank lines in code blocks', async () => {
    const orgContent = `#+begin_src text
  First line

  Third line
#+end_src`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.markdown).toContain(
      '```text\n  First line\n\n  Third line\n```',
    );
  });

  it('should handle multiple code blocks in the same document', async () => {
    const orgContent = `First paragraph.

#+begin_src javascript
console.log('first block');
#+end_src

Some text in between.

#+begin_src python
print("second block")
#+end_src

Final paragraph.`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.markdown).toBe(`First paragraph.

\`\`\`javascript
console.log('first block');
\`\`\`

Some text in between.

\`\`\`python
print("second block")
\`\`\`

Final paragraph.`);
  });

  it('should handle code blocks without language specification', async () => {
    const orgContent = `#+begin_src
some code without language
#+end_src`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.markdown).toBe(`\`\`\`
some code without language
\`\`\``);
  });

  it('should handle code blocks with special characters and multiple lines', async () => {
    const orgContent = `#+begin_src javascript
function test() {
  const regex = /test/;
  const template = \`Hello \${name}!\`;
  return "multi-line
string";
}
#+end_src`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.markdown).toBe(`\`\`\`javascript
function test() {
  const regex = /test/;
  const template = \`Hello \${name}!\`;
  return "multi-line
string";
}
\`\`\``);
  });

  it('should preserve org syntax inside text code blocks', async () => {
    const orgContent = `#+begin_src text
#+begin_src javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
console.log(fibonacci(10));
#+end_src

#+begin_src python
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)
print(quicksort([3, 6, 8, 10, 1, 2, 1]))
#+end_src
#+end_src`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.markdown).toBe(`\`\`\`text
#+begin_src javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
console.log(fibonacci(10));
#+end_src

#+begin_src python
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)
print(quicksort([3, 6, 8, 10, 1, 2, 1]))
#+end_src
\`\`\``);
  });

  describe('extractOrgKeywords', () => {
    it('should extract TITLE keyword', () => {
      const orgContent = `#+TITLE: Test Title

Content here.`;

      const keywords = extractOrgKeywords(orgContent);

      expect(keywords.title).toBe('Test Title');
    });

    it('should extract multiple keywords', () => {
      const orgContent = `#+TITLE: Test Title
#+AUTHOR: Test Author
#+DESCRIPTION: Test Description

Content here.`;

      const keywords = extractOrgKeywords(orgContent);

      expect(keywords.title).toBe('Test Title');
      expect(keywords.author).toBe('Test Author');
      expect(keywords.description).toBe('Test Description');
    });

    it('should handle keywords with special characters', () => {
      const orgContent = `#+TITLE: Title with "quotes" and 'apostrophes'

Content here.`;

      const keywords = extractOrgKeywords(orgContent);

      expect(keywords.title).toBe('Title with "quotes" and \'apostrophes\'');
    });
  });

  describe('getCalloutTypeFromOrgType', () => {
    it('should map org callout types to fumadocs types', () => {
      expect(getCalloutTypeFromOrgType('warning')).toBe('warning');
      expect(getCalloutTypeFromOrgType('error')).toBe('error');
      expect(getCalloutTypeFromOrgType('info')).toBe('info');
      expect(getCalloutTypeFromOrgType('note')).toBe('note');
      expect(getCalloutTypeFromOrgType('tip')).toBe('tip');
      expect(getCalloutTypeFromOrgType('caution')).toBe('caution');
    });

    it('should return null for unknown types', () => {
      expect(getCalloutTypeFromOrgType('unknown')).toBeNull();
      expect(getCalloutTypeFromOrgType('')).toBeNull();
    });

    it('should be case insensitive', () => {
      expect(getCalloutTypeFromOrgType('WARNING')).toBe('warning');
      expect(getCalloutTypeFromOrgType('Error')).toBe('error');
    });
  });
});
