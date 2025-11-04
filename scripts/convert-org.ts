import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { convertOrgToMdx } from '../src/lib/org-mode/index';
import { globSync } from 'glob';

/**
 * Calculate MD5 checksum of a file
 */
function calculateMd5(filePath: string): string {
  const fileContent = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(fileContent).digest('hex');
}

/**
 * Get cached checksum for a file
 */
function getCachedChecksum(mdxPath: string): string | null {
  const checksumPath = `${mdxPath}.md5sum`;
  if (fs.existsSync(checksumPath)) {
    return fs.readFileSync(checksumPath, 'utf8').trim();
  }
  return null;
}

/**
 * Save checksum for a file
 */
function saveChecksum(mdxPath: string, checksum: string): void {
  const checksumPath = `${mdxPath}.md5sum`;
  fs.writeFileSync(checksumPath, checksum);
}

async function main() {
  const contentDir = 'content/docs';
  const cacheDir = '.cache/docs';

  // Ensure cache directory exists
  fs.mkdirSync(cacheDir, { recursive: true });

  // Find all .org files
  const orgFiles = globSync('**/*.org', { cwd: contentDir });

  // Clean up orphaned .mdx files and their checksums
  const existingMdxFiles = globSync('**/*.mdx', { cwd: cacheDir });
  for (const mdxFile of existingMdxFiles) {
    const orgFile = mdxFile.replace(/\.mdx$/, '.org');
    if (!orgFiles.includes(orgFile)) {
      const mdxPath = path.join(cacheDir, mdxFile);
      const checksumPath = `${mdxPath}.md5sum`;

      fs.unlinkSync(mdxPath);
      if (fs.existsSync(checksumPath)) {
        fs.unlinkSync(checksumPath);
      }
      console.log(`Removed orphaned .mdx: ${mdxFile}`);
    }
  }

  for (const orgFile of orgFiles) {
    const orgPath = path.join(contentDir, orgFile);
    const mdxPath = path.join(cacheDir, orgFile.replace(/\.org$/, '.mdx'));

    // Ensure destination directory exists
    fs.mkdirSync(path.dirname(mdxPath), { recursive: true });

    // Calculate current MD5 checksum
    const currentChecksum = calculateMd5(orgPath);

    // Check if we need to re-convert
    const cachedChecksum = getCachedChecksum(mdxPath);
    if (cachedChecksum === currentChecksum && fs.existsSync(mdxPath)) {
      console.log(`Skipped ${orgFile} (unchanged)`);
      continue;
    }

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

    // Save checksum
    saveChecksum(mdxPath, currentChecksum);

    console.log(
      `Converted ${orgFile} to .cache/docs/${orgFile.replace('.org', '.mdx')}`,
    );
  }
}

main().catch(console.error);
