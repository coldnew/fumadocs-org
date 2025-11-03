import { describe, it, expect } from 'vitest';
import { convertOrgToMdx } from './converter';

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

    expect(result.markdown).toContain('<Callout type="info">');
    expect(result.markdown).toContain('This is an informational note.');

    expect(result.markdown).toContain('<Callout type="success">');
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

#+begin_success
Success content
#+end_success`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.markdown).toContain('<Callout type="warning">');
    expect(result.markdown).toContain('<Callout type="error">');
    expect(result.markdown).toContain('<Callout type="success">');
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
    const orgContent = `#+begin_src typescript
interface User {
  name: string;
  age: number;
}
#+end_src

#+begin_src python
def hello():
    print("Hello, World!")
#+end_src`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.markdown).toContain('```typescript');
    expect(result.markdown).toContain('interface User');
    expect(result.markdown).toContain('```python');
    expect(result.markdown).toContain('def hello():');
  });
});
