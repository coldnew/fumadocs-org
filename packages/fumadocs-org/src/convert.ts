import { glob } from 'tinyglobby';
import { readFile, writeFile } from 'node:fs/promises';
import { convertOrgToMdx } from './core/index';
import * as path from 'node:path';

export async function convertOrgFilesToMdx() {
  const orgFiles = await glob('content/**/*.org', {
    cwd: process.cwd(),
  });

  if (orgFiles.length === 0) {
    console.log('[ORG] No org files found.');
    return;
  }

  // Check if org support plugin is being used (by checking source.config.ts)
  try {
    const sourceConfig = await readFile('source.config.ts', 'utf-8');
    const usesOrgSupport = sourceConfig.includes('orgSupportPlugin');

    if (usesOrgSupport) {
      console.log(
        '[ORG] Org support plugin detected, skipping MDX generation.',
      );
      console.log('[ORG] Org files will be processed directly by loaders.');
      return;
    }
  } catch (error) {
    // If we can't read source config, proceed with conversion
    console.log(
      '[ORG] Could not check source config, proceeding with conversion.',
    );
  }

  console.log(`[ORG] Found ${orgFiles.length} org files to convert:`);

  for (const orgFile of orgFiles) {
    const mdxFile = orgFile.replace('.org', '.mdx');
    const orgContent = await readFile(orgFile, 'utf-8');
    const conversionResult = await convertOrgToMdx(orgContent, orgFile);
    const mdxContent = `---\n${conversionResult.frontmatter}---\n${conversionResult.markdown}`;
    await writeFile(mdxFile, mdxContent, 'utf-8');
    console.log(`[ORG] Converted ${orgFile} to ${mdxFile}`);
  }
}
