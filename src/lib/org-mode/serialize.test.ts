import { describe, it, expect } from 'vitest';
import { convertOrgToMdx } from './serialize';

describe('serialize (Org → MDX)', () => {
  it('should convert basic Org content to MDX', async () => {
    const orgContent = `* Hello World

This is a test paragraph.

- List item 1
- List item 2

#+begin_src javascript
console.log('hello');
#+end_src

Some *bold* and /italic/ text.`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.frontmatter).toBe(
      '---\ntitle: Test\ndescription: Generated from Org-mode\n---\n\n',
    );
    expect(result.markdown).toBe(`# Hello World

This is a test paragraph.

* List item 1
* List item 2

\`\`\`javascript
console.log('hello');
\`\`\`

Some **bold** and *italic* text.`);
  });

  it('should extract TITLE keyword', async () => {
    const orgContent = `#+TITLE: Test Document

Some content.`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.frontmatter).toBe(
      '---\ntitle: Test Document\ndescription: Generated from Org-mode\n---\n\n',
    );
    expect(result.markdown).toBe('Some content.');
  });

  it('should include multiple keywords in frontmatter', async () => {
    const orgContent = `#+TITLE: Test Document
#+AUTHOR: Test Author
#+DESCRIPTION: Test Description

Some content.`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.frontmatter).toBe(
      '---\ntitle: Test Document\nauthor: Test Author\ndescription: Test Description\n---\n\n',
    );
    expect(result.markdown).toBe('Some content.');
  });

  it('should convert Org headings to Markdown', async () => {
    const orgContent = `* Level 1
** Level 2
*** Level 3

Content under headings.`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.frontmatter).toBe(
      '---\ntitle: Test\ndescription: Generated from Org-mode\n---\n\n',
    );
    expect(result.markdown).toBe(`# Level 1

## Level 2

### Level 3

Content under headings.`);
  });

  it('should convert Org lists to Markdown', async () => {
    const orgContent = `- Item 1
- Item 2
  - Nested item
- Item 3`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.frontmatter).toBe(
      '---\ntitle: Test\ndescription: Generated from Org-mode\n---\n\n',
    );
    expect(result.markdown).toBe(`* Item 1
* Item 2
  * Nested item
* Item 3`);
  });

  it('should preserve code blocks', async () => {
    const orgContent = `#+begin_src javascript
function test() {
  console.log('hello');
}
#+end_src`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.frontmatter).toBe(
      '---\ntitle: Test\ndescription: Generated from Org-mode\n---\n\n',
    );
    expect(result.markdown).toBe(`\`\`\`javascript
function test() {
  console.log('hello');
}
\`\`\``);
  });

  it('should convert Org tables to Markdown', async () => {
    const orgContent = `| Name | Age |
|------|-----|
| Alice | 25 |
| Bob | 30 |`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.frontmatter).toBe(
      '---\ntitle: Test\ndescription: Generated from Org-mode\n---\n\n',
    );
    expect(result.markdown).toBe(`| Name  | Age |
| ----- | --- |
| Alice | 25  |
| Bob   | 30  |`);
  });

  it('should convert links', async () => {
    const orgContent = `[[https://example.com][Example Link]]`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.frontmatter).toBe(
      '---\ntitle: Test\ndescription: Generated from Org-mode\n---\n\n',
    );
    expect(result.markdown).toBe('[Example Link](https://example.com)');
  });

  it('should handle TODO keywords', async () => {
    const orgContent = `* TODO Task 1
* DONE Task 2
* Task 3`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.frontmatter).toBe(
      '---\ntitle: Test\ndescription: Generated from Org-mode\n---\n\n',
    );
    expect(result.markdown).toBe(`# TODO Task 1

# DONE Task 2

# Task 3`);
  });

  it('should convert Org math expressions to LaTeX', async () => {
    const orgContent = `Some math: $E = mc^2$ and display $$\int_0^1 x dx$$`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.frontmatter).toBe(
      '---\ntitle: Test\ndescription: Generated from Org-mode\n---\n\n',
    );
    expect(result.markdown).toBe(
      'Some math: $E = mc^2$ and display $int\\_0^1 x dx$',
    );
  });

  it('should convert Org callout blocks to Fumadocs Callouts', async () => {
    const orgContent = `#+begin_note
This is a note.
#+end_note

#+begin_warning
This is a warning.
#+end_warning`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.frontmatter).toBe(
      '---\ntitle: Test\ndescription: Generated from Org-mode\n---\n\n',
    );
    expect(result.markdown).toBe(`<Callout type="note">
This is a note.
</Callout>

<Callout type="warning">
This is a warning.
</Callout>`);
  });

  it('should handle empty content', async () => {
    const orgContent = '';

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.frontmatter).toBe(
      '---\ntitle: Test\ndescription: Generated from Org-mode\n---\n\n',
    );
    expect(result.markdown).toBe('');
  });

  it('should handle malformed Org syntax gracefully', async () => {
    const orgContent = `* Unclosed heading

Some text without proper structure.`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.frontmatter).toBe(
      '---\ntitle: Test\ndescription: Generated from Org-mode\n---\n\n',
    );
    expect(result.markdown).toBe(`# Unclosed heading

Some text without proper structure.`);
  });
});
