import fs from 'fs';
import path from 'path';
import { convertOrgToMdx } from '../src/lib/org-mode/index';
import { globSync } from 'glob';

async function main() {
  const contentDir = 'content/docs';
  const cacheDir = '.cache/docs';

  // Ensure cache directory exists
  fs.mkdirSync(cacheDir, { recursive: true });

  // Find all .org files
  const orgFiles = globSync('**/*.org', { cwd: contentDir });

  for (const orgFile of orgFiles) {
    const orgPath = path.join(contentDir, orgFile);
    const mdxPath = path.join(cacheDir, orgFile.replace(/\.org$/, '.mdx'));

    // Ensure destination directory exists
    fs.mkdirSync(path.dirname(mdxPath), { recursive: true });

    // Read org content
    const orgContent = fs.readFileSync(orgPath, 'utf8');

    // Convert using the library
    const result = await convertOrgToMdx(
      orgContent,
      path.basename(orgFile, '.org'),
    );

    // Add generated comment
    const comment = `{/* This file is auto-generated from ${orgFile}. Do not edit directly. */}\n\n`;
    const finalContent = result.frontmatter + comment + result.markdown;

    // Write to .cache/docs/
    fs.writeFileSync(mdxPath, finalContent);

    console.log(
      `Converted ${orgFile} to .cache/docs/${orgFile.replace('.org', '.mdx')}`,
    );
  }
}

main().catch(console.error);
