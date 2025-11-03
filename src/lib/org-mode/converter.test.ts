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
});