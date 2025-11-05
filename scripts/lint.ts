import { glob } from 'glob';
import matter from 'gray-matter';
import fs from 'fs';

async function validateTitles() {
  const files = await glob('content/**/*.{mdx,org}');

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    let title: string | undefined;

    if (file.endsWith('.mdx')) {
      const { data } = matter(content);
      title = data.title;
    } else if (file.endsWith('.org')) {
      const titleLine = content
        .split('\n')
        .find((line) => /^#\+title:/i.test(line));
      if (titleLine) {
        title = titleLine.replace(/^#\+title:/i, '').trim();
      }
    }

    if (!title || title.trim() === '') {
      console.error(`Missing or empty title in ${file}`);
      process.exit(1);
    }
  }

  console.log('All titles validated successfully');
}

validateTitles().catch(console.error);
