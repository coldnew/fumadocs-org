import fs from 'fs';
import path from 'path';
import { convertOrgToMdx } from '../src/lib/org-mode/index';
import { globSync } from 'glob';

async function main() {
  const docsDir = 'content/docs';

  // Find all .org files
  const orgFiles = globSync('**/*.org', { cwd: docsDir });

  for (const orgFile of orgFiles) {
    const orgPath = path.join(docsDir, orgFile);
    const mdxPath = orgPath.replace(/\.org$/, '.mdx');

    // Read org content
    const orgContent = fs.readFileSync(orgPath, 'utf8');

    // Convert using the library
    const result = await convertOrgToMdx(orgContent, path.basename(orgFile, '.org'));

    // Add generated comment
    const comment = `{/* This file is auto-generated from ${orgFile}. Do not edit directly. */}\n\n`;
    const finalContent = result.frontmatter + comment + result.markdown;

    // Write to .mdx file
    fs.writeFileSync(mdxPath, finalContent);

    console.log(`Converted ${orgFile} to ${orgFile.replace('.org', '.mdx')}`);
  }
}

main().catch(console.error);