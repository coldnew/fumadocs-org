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

    expect(result.frontmatter).toBe(`---
title: Test
description: Generated from Org-mode
---

`);
    expect(result.markdown).toBe(`# Hello World

This is a test.`);
  });

  it('should extract TITLE keyword', async () => {
    const orgContent = `#+TITLE: Custom Title

Content here.`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.frontmatter).toBe(`---
title: Custom Title
description: Generated from Org-mode
---

`);
    expect(result.markdown).toBe(`Content here.`);
  });

  it('should include multiple keywords in frontmatter', async () => {
    const orgContent = `#+TITLE: Test Document
#+AUTHOR: Test Author
#+DESCRIPTION: A test document

Some content.`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.frontmatter).toBe(`---
title: Test Document
author: Test Author
description: A test document
---

`);
    expect(result.markdown).toBe(`Some content.`);
  });

  it('should convert Org headings to Markdown', async () => {
    const orgContent = `* Level 1
** Level 2
*** Level 3

Content under headings.`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.frontmatter).toBe(`---
title: Test
description: Generated from Org-mode
---

`);
    expect(result.markdown).toBe(`# Level 1

## Level 2

### Level 3

Content under headings.`);
  });

  it('should convert Org lists to Markdown', async () => {
    const orgContent = `- Item 1
- Item 2
  - Nested item

1. Numbered item 1
2. Numbered item 2`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.frontmatter).toBe(`---
title: Test
description: Generated from Org-mode
---

`);
    expect(result.markdown).toBe(`* Item 1
* Item 2
  * Nested item
* Numbered item 1
* Numbered item 2`);
  });

  it('should preserve code blocks', async () => {
    const orgContent = `#+begin_src javascript
console.log('hello');
#+end_src`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.frontmatter).toBe(`---
title: Test
description: Generated from Org-mode
---

`);
    expect(result.markdown).toBe(`\`\`\`javascript
console.log('hello');
\`\`\``);
  });

  it('should convert Org tables to Markdown', async () => {
    const orgContent = `| Name    | Age | Occupation  |
|---------+-----+-------------|
| Alice   |  25 | Engineer    |
| Bob     |  30 | Designer    |`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.frontmatter).toBe(`---
title: Test
description: Generated from Org-mode
---

`);
    expect(result.markdown).toBe(`| Name  | Age | Occupation |
| ----- | --- | ---------- |
| Alice | 25  | Engineer   |
| Bob   | 30  | Designer   |`);
  });

  it('should convert links', async () => {
    const orgContent = `Visit [[https://example.com][Example Site]] for more info.`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.frontmatter).toBe(`---
title: Test
description: Generated from Org-mode
---

`);
    expect(result.markdown).toBe(
      `Visit [Example Site](https://example.com) for more info.`,
    );
  });

  it('should handle TODO keywords', async () => {
    const orgContent = `* DONE Completed task
* TODO Pending task`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.frontmatter).toBe(`---
title: Test
description: Generated from Org-mode
---

`);
    expect(result.markdown).toBe(`# DONE Completed task

# TODO Pending task`);
  });

  it('should convert Org math expressions to LaTeX', async () => {
    const orgContent = `Inline math: $E = mc^2$

Display math:
$$\int_0^1 f(x) \, dx$$

Complex formula:
$$\lim_{x \to 0} \frac{\sin x}{x} = 1$$`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.frontmatter).toBe(`---
title: Test
description: Generated from Org-mode
---

`);
    expect(result.markdown).toBe(`Inline math: $E = mc^2$

Display math: $$ int\\_0^1 f(x) , dx $$

Complex formula: $$ lim\\_{x o 0} rac{sin x}{x} = 1 $$`);
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

    expect(result.markdown).toBe(`<Callout type="warning">
This is a warning message.
</Callout>

<Callout type="note">
This is an informational note.
</Callout>

<Callout type="tip">
Here's a helpful tip.
</Callout>`);
  });

  it('should preserve formatting inside callouts', async () => {
    const orgContent = `#+begin_warning
This is a *bold* message with /italic/ text and $math$ formula.
#+end_warning`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.markdown).toBe(`<Callout type="warning">
This is a **bold** message with *italic* text and $math$ formula.
</Callout>`);
  });

  it('should handle empty content', async () => {
    const orgContent = ``;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.frontmatter).toBe(`---
title: Test
description: Generated from Org-mode
---

`);
    expect(result.markdown).toBe(``);
  });

  it('should handle malformed Org syntax gracefully', async () => {
    const orgContent = `* Unclosed heading

Some content without proper structure.`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.frontmatter).toBe(`---
title: Test
description: Generated from Org-mode
---

`);
    expect(result.markdown).toBe(`# Unclosed heading

Some content without proper structure.`);
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

    expect(result.markdown).toBe(`<Callout type="warning">
Warning content
</Callout>

<Callout type="error">
Error content
</Callout>

<Callout type="info">
Info content
</Callout>`);
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

    expect(result.frontmatter).toBe(`---
title: Test
description: Generated from Org-mode
---

`);
    expect(result.markdown).toBe(`# Heading

Some paragraph with **bold** and *italic* text.

* List item 1
* List item 2

| Table | Column |
| ----- | ------ |
| Data  | Here   |

[Link](https://example.com)`);
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

    expect(result.frontmatter).toBe(`---
title: Test
description: Generated from Org-mode
---

`);
    expect(result.markdown).toBe(`* Item 1

  * Subitem 1.1
  * Subitem 1.2

* Item 2

  1. Numbered subitem 2.1
  2. Numbered subitem 2.2`);
  });

  it('should handle code blocks with language', async () => {
    const orgContent = `#+begin_src javascript
function hello() {
  console.log("Hello World");
}
#+end_src`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.frontmatter).toBe(`---
title: Test
description: Generated from Org-mode
---

`);
    expect(result.markdown).toBe(`\`\`\`javascript
function hello() {
  console.log("Hello World");
}
\`\`\``);
  });

  it('should convert latex blocks to math blocks', async () => {
    const orgContent = `#+begin_latex
E = mc^2
#+end_latex`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.frontmatter).toBe(`---
title: Test
description: Generated from Org-mode
---

`);
    expect(result.markdown).toBe(`\`\`\`math
E = mc^2
\`\`\``);
  });

  it('should handle frontmatter with special characters', async () => {
    const orgContent = `#+TITLE: Title with "quotes" and 'apostrophes'
#+DESCRIPTION: Description with special chars: @#$%^&*()

Content here.`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.frontmatter).toBe(`---
title: Title with "quotes" and 'apostrophes'
description: 'Description with special chars: @#$%^&*()'
---

`);
    expect(result.markdown).toBe(`Content here.`);
  });

  it('should handle code blocks with syntax highlighting', async () => {
    const orgContent = `#+begin_src javascript
function hello() {
  console.log("Hello World");
}
#+end_src`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.frontmatter).toBe(`---
title: Test
description: Generated from Org-mode
---

`);
    expect(result.markdown).toBe(`\`\`\`javascript
function hello() {
  console.log("Hello World");
}
\`\`\``);
  });

  it('should preserve indentation in code blocks containing org syntax', async () => {
    const orgContent = `#+begin_src text
  #+begin_warning
  This is indented content.
  #+end_warning
#+end_src`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.frontmatter).toBe(`---
title: Test
description: Generated from Org-mode
---

`);
    expect(result.markdown).toBe(`\`\`\`text
  #+begin_warning
  This is indented content.
  #+end_warning
\`\`\``);
    // Ensure callouts inside code blocks are not converted
    expect(result.markdown).not.toContain('<Callout type="warning">');
  });

  it('should preserve blank lines in code blocks', async () => {
    const orgContent = `#+begin_src text
  First line

  Third line
#+end_src`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.frontmatter).toBe(`---
title: Test
description: Generated from Org-mode
---

`);
    expect(result.markdown).toBe(`\`\`\`text
  First line

  Third line
\`\`\``);
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

  it('should convert example blocks to markdown code blocks', async () => {
    const orgContent = `#+begin_example
Some example text
with *markup* that should be preserved.
#+end_example`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.frontmatter).toBe(`---
title: Test
description: Generated from Org-mode
---

`);
    expect(result.markdown).toBe(`\`\`\`
Some example text
with *markup* that should be preserved.
\`\`\``);
  });

  it('should remove comment blocks', async () => {
    const orgContent = `Some text

#+begin_comment
This is a comment
#+end_comment

More text.`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.frontmatter).toBe(`---
title: Test
description: Generated from Org-mode
---

`);
    expect(result.markdown).toBe(`Some text

More text.`);
  });

  it('should convert org code blocks to text language for syntax highlighting', async () => {
    const orgContent = `#+begin_src org
#+begin_src javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
console.log(fibonacci(10));
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
\`\`\``);
  });

  it('should convert #+HTML: directives to JSX', async () => {
    const orgContent = `#+HTML: <div class="alert alert-info">This is an info alert</div>

Some text in between.

#+HTML: <button class="btn btn-primary">Click me</button>`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.markdown)
      .toBe(`<div className="alert alert-info">This is an info alert</div>

Some text in between.

<button className="btn btn-primary">Click me</button>`);
  });

  it('should convert HTML attributes to JSX format', async () => {
    const orgContent = `#+HTML: <div style="color: red; font-size: 14px;"><strong>Important:</strong> This is styled text.</div>`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.markdown).toBe(
      `<div style={{ color: "red", fontSize: 14 }}><strong>Important:</strong> This is styled text.</div>`,
    );
  });

  it('should support case-insensitive #+HTML: directives', async () => {
    const orgContent = `#+html: <div class="lowercase">Lowercase</div>

#+HTML: <div class="uppercase">Uppercase</div>

#+Html: <div class="mixed">Mixed case</div>`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.markdown).toBe(`<div className="lowercase">Lowercase</div>

<div className="uppercase">Uppercase</div>

<div className="mixed">Mixed case</div>`);
  });

  it('should convert lowercase #+html: directives to JSX', async () => {
    const orgContent = `#+html: <span class="highlight">This is highlighted text</span>

#+html: <em>Emphasized text</em>`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.markdown)
      .toBe(`<span className="highlight">This is highlighted text</span>

<em>Emphasized text</em>`);
  });

  it('should convert #+begin_export html blocks to JSX', async () => {
    const orgContent = `#+begin_export html
<div class="alert alert-info">
  <h3>Important Notice</h3>
  <p>This is a multi-line HTML block that gets converted to JSX.</p>
</div>
#+end_export

Some text after the block.`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.markdown).toBe(`<div className="alert alert-info">
  <h3>Important Notice</h3>
  <p>This is a multi-line HTML block that gets converted to JSX.</p>
</div>

Some text after the block.`);
  });

  it('should handle multiple #+begin_export html blocks', async () => {
    const orgContent = `First block:

#+begin_export html
<button class="btn btn-primary">Click me</button>
#+end_export

Second block:

#+begin_export html
<span style="color: red;">Red text</span>
#+end_export`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.markdown).toBe(`First block:

<button className="btn btn-primary">Click me</button>

Second block:

<span style={{ color: "red" }}>Red text</span>`);
  });

  it('should convert #+JSX: directives to JSX without transformation', async () => {
    const orgContent = `#+JSX: <Button variant="primary" onClick={handleClick}>Click me</Button>

Some text in between.

#+JSX: <div className="alert">This is already JSX</div>`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.markdown)
      .toBe(`<Button variant="primary" onClick={handleClick}>Click me</Button>

Some text in between.

<div className="alert">This is already JSX</div>`);
  });

  it('should support case-insensitive #+JSX: directives', async () => {
    const orgContent = `#+jsx: <Component prop="lowercase" />

#+JSX: <Component prop="uppercase" />

#+Jsx: <Component prop="mixed" />`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.markdown).toBe(`<Component prop="lowercase" />

<Component prop="uppercase" />

<Component prop="mixed" />`);
  });

  it('should convert #+begin_export jsx blocks to JSX without transformation', async () => {
    const orgContent = `#+begin_export jsx
<div className="card">
  <div className="card-header">
    <h3>Card Title</h3>
  </div>
  <div className="card-body">
    <p>This is JSX content that gets preserved exactly.</p>
    <button className="btn btn-primary">Action</button>
  </div>
</div>
#+end_export

Some text after the JSX block.`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.markdown).toBe(`<div className="card">
  <div className="card-header">
    <h3>Card Title</h3>
  </div>
  <div className="card-body">
    <p>This is JSX content that gets preserved exactly.</p>
    <button className="btn btn-primary">Action</button>
  </div>
</div>

Some text after the JSX block.`);
  });

  it('should handle multiple generic export blocks including JSX', async () => {
    const orgContent = `JSX block:

#+begin_export jsx
<header className="hero">
  <h1>Welcome</h1>
</header>
#+end_export

Markdown block:

#+begin_export markdown
# Raw Markdown

This is **bold** text.
#+end_export

Another JSX block:

#+begin_export jsx
<footer className="footer">
  <p>&copy; 2024</p>
</footer>
#+end_export`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.markdown).toBe(`JSX block:

<header className="hero">
  <h1>Welcome</h1>
</header>

Markdown block:

# Raw Markdown

This is **bold** text.

Another JSX block:

<footer className="footer">
  <p>&copy; 2024</p>
</footer>`);
  });

  it('should handle generic #+begin_export blocks (export as-is)', async () => {
    const orgContent = `Markdown content:

#+begin_export markdown
# Exported Markdown

This is **bold** text and *italic* text.

- List item 1
- List item 2
#+end_export

LaTeX content:

#+begin_export latex
\begin{equation}
E = mc^2
\end{equation}
#+end_export`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.markdown).toBe(`Markdown content:

# Exported Markdown

This is **bold** text and *italic* text.

- List item 1
- List item 2

LaTeX content:

\begin{equation}
E = mc^2
\end{equation}`);
  });

  it('should skip export blocks with :noexport: property', async () => {
    const orgContent = `Visible content:

#+begin_export markdown
# This should be visible
Visible paragraph.
#+end_export

Hidden content:

#+begin_export markdown :noexport:
# This should be hidden
Hidden paragraph.
#+end_export

More visible content:

#+begin_export latex
\begin{equation}
E = mc^2
\end{equation}
#+end_export`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.markdown).toBe(`Visible content:

# This should be visible
Visible paragraph.

Hidden content:

More visible content:

\begin{equation}
E = mc^2
\end{equation}`);
  });

  it('should skip HTML export blocks with :noexport: property', async () => {
    const orgContent = `Visible HTML:

#+begin_export html
<div class="visible">This should be visible</div>
#+end_export

Hidden HTML:

#+begin_export html :noexport:
<div class="hidden">This should be hidden</div>
#+end_export

More visible content.`;

    const result = await convertOrgToMdx(orgContent, 'test');

    expect(result.markdown).toBe(`Visible HTML:

<div className="visible">This should be visible</div>

Hidden HTML:

More visible content.`);
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
