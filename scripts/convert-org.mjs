import fs from 'fs';
import path from 'path';
import { unified } from 'unified';
import parse from 'uniorg-parse';
import uniorg2rehype from 'uniorg-rehype';
import rehypeRemark from 'rehype-remark';
import remarkGfm from 'remark-gfm';
import remarkStringify from 'remark-stringify';
import { globSync } from 'glob';

const docsDir = 'content/docs';

// Find all .org files
const orgFiles = globSync('**/*.org', { cwd: docsDir });

for (const orgFile of orgFiles) {
  const orgPath = path.join(docsDir, orgFile);
  const mdxPath = orgPath.replace(/\.org$/, '.mdx');

  // Read org content
  const orgContent = fs.readFileSync(orgPath, 'utf8');

  // Extract TITLE from org content
  const titleMatch = orgContent.match(/^#\+TITLE:\s*(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : path.basename(orgFile, '.org').replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  // Convert to markdown
  const markdown = unified()
    .use(parse)
    .use(uniorg2rehype)
    .use(rehypeRemark)
    .use(remarkGfm)
    .use(remarkStringify)
    .processSync(orgContent)
    .toString();

  // Generate frontmatter
  const frontmatter = `---\ntitle: ${title}\ndescription: Generated from Org-mode\n---\n\n`;

  // Add generated comment as MDX comment
  const comment = `{/* This file is auto-generated from ${orgFile}. Do not edit directly. */}\n\n`;
  const finalContent = frontmatter + comment + markdown;

  // Write to .mdx file
  fs.writeFileSync(mdxPath, finalContent);

  console.log(`Converted ${orgFile} to ${orgFile.replace('.org', '.mdx')}`);
}