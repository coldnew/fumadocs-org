import { describe, it, expect } from 'vitest';
import { createHighlighter } from 'shiki';
import { shikiLanguages } from './languages';

describe('Org-mode syntax highlighting', () => {
  it('should highlight headlines correctly', async () => {
    const highlighter = await createHighlighter({
      langs: shikiLanguages,
      themes: ['github-light'],
    });

    const code = `* Top Level Headline
** Second Level
*** Third Level`;

    const html = highlighter.codeToHtml(code, {
      lang: 'org',
      theme: 'github-light',
    });

    expect(html).toContain('class="line"');
    expect(html).toContain('*'); // Should contain the asterisks
    expect(html).toBeTruthy();
  });

  it('should highlight TODO keywords', async () => {
    const highlighter = await createHighlighter({
      langs: shikiLanguages,
      themes: ['github-light'],
    });

    const code = `* TODO Write documentation
* DONE Implement feature
* IN_PROGRESS Review code`;

    const html = highlighter.codeToHtml(code, {
      lang: 'org',
      theme: 'github-light',
    });

    expect(html).toContain('TODO');
    expect(html).toContain('DONE');
    expect(html).toContain('IN_PROGRESS');
  });

  it('should highlight code blocks', async () => {
    const highlighter = await createHighlighter({
      langs: shikiLanguages,
      themes: ['github-light'],
    });

    const code = `#+BEGIN_SRC javascript
console.log("Hello World");
#+END_SRC`;

    const html = highlighter.codeToHtml(code, {
      lang: 'org',
      theme: 'github-light',
    });

    expect(html).toContain('BEGIN_SRC');
    expect(html).toContain('END_SRC');
    expect(html).toContain('javascript');
  });

  it('should highlight links', async () => {
    const highlighter = await createHighlighter({
      langs: shikiLanguages,
      themes: ['github-light'],
    });

    const code = `[[https://example.com][Example Link]]
[[file:~/documents/note.org][Local File]]`;

    const html = highlighter.codeToHtml(code, {
      lang: 'org',
      theme: 'github-light',
    });

    expect(html).toContain('https://example.com');
    expect(html).toContain('Example Link');
    expect(html).toContain('file:~/documents/note.org');
  });

  it('should highlight timestamps', async () => {
    const highlighter = await createHighlighter({
      langs: shikiLanguages,
      themes: ['github-light'],
    });

    const code = `<2024-01-01 Mon>
[2024-01-01 Mon 10:00]`;

    const html = highlighter.codeToHtml(code, {
      lang: 'org',
      theme: 'github-light',
    });

    expect(html).toContain('2024-01-01');
    expect(html).toContain('Mon');
    expect(html).toContain('10:00');
  });
});
