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
 * Extract checksum from .org.mdx file
 */
function getEmbeddedChecksum(mdxPath: string): string | null {
  if (!fs.existsSync(mdxPath)) {
    return null;
  }
  // Read only first 500 bytes since checksum is in the header comment
  const stream = fs.createReadStream(mdxPath, {
    encoding: 'utf8',
    start: 0,
    end: 499,
  });
  let content = '';
  for await (const chunk of stream) {
    content += chunk;
    const match = content.match(/checksum:\s*([a-f0-9]{32})/);
    if (match) {
      return match[1];
    }
  }
  return null;
}

async function main() {
  const contentDir = 'content/docs';

  // Find all .org files
  const orgFiles = globSync('**/*.org', { cwd: contentDir });

  // Clean up orphaned .org.mdx files and their checksums
  const existingMdxFiles = globSync('**/*.org.mdx', { cwd: contentDir });
  for (const mdxFile of existingMdxFiles) {
    const orgFile = mdxFile.replace(/\.org\.mdx$/, '.org');
    if (!orgFiles.includes(orgFile)) {
      const mdxPath = path.join(contentDir, mdxFile);
      const checksumPath = `${mdxPath}.md5sum`;

      fs.unlinkSync(mdxPath);
      if (fs.existsSync(checksumPath)) {
        fs.unlinkSync(checksumPath);
      }
      console.log(`Removed orphaned .org.mdx: ${mdxFile}`);
    }
  }

  // Clean up old .org.md5sum files (from previous approach)
  const oldChecksumFiles = globSync('**/*.org.md5sum', { cwd: contentDir });
  for (const checksumFile of oldChecksumFiles) {
    const checksumPath = path.join(contentDir, checksumFile);
    fs.unlinkSync(checksumPath);
    console.log(`Removed old checksum file: ${checksumFile}`);
  }

  for (const orgFile of orgFiles) {
    const orgPath = path.join(contentDir, orgFile);
    const mdxPath = path.join(
      contentDir,
      orgFile.replace(/\.org$/, '.org.mdx'),
    );

    // Ensure destination directory exists
    fs.mkdirSync(path.dirname(mdxPath), { recursive: true });

    // Calculate current MD5 checksum
    const currentChecksum = calculateMd5(orgPath);

    // Check if we need to re-convert
    const cachedChecksum = getEmbeddedChecksum(mdxPath);
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

    // Add generated comment with checksum
    const comment = `{/* This file is auto-generated from ${orgFile}. Do not edit directly. checksum: ${currentChecksum} */}\n\n`;
    const finalContent = result.frontmatter + comment + result.markdown;

    // Write to content/docs/
    fs.writeFileSync(mdxPath, finalContent);

    console.log(
      `Converted ${orgFile} to ${orgFile.replace('.org', '.org.mdx')}`,
    );
  }
}

main().catch(console.error);
