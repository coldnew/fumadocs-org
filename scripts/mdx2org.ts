import fs from 'fs';
import path from 'path';
import { convertMdxToOrg } from '../packages/org2mdx/dist/index.js';

/**
 * Convert MDX file to Org format for manual testing
 */
async function convertMdxFile(mdxPath: string, outputPath?: string) {
  if (!fs.existsSync(mdxPath)) {
    console.error(`File not found: ${mdxPath}`);
    process.exit(1);
  }

  // Read MDX content
  const mdxContent = fs.readFileSync(mdxPath, 'utf8');

  // Convert to Org
  const result = await convertMdxToOrg(
    mdxContent,
    path.basename(mdxPath, '.mdx'),
  );

  // Combine keywords and org content
  const finalContent = result.keywords + result.org;

  // Determine output path
  const actualOutputPath = outputPath || mdxPath.replace(/\.mdx$/, '.org');

  // Ensure output directory exists
  fs.mkdirSync(path.dirname(actualOutputPath), { recursive: true });

  // Write Org file
  fs.writeFileSync(actualOutputPath, finalContent);

  console.log(`Converted ${mdxPath} to ${actualOutputPath}`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: tsx scripts/mdx2org.ts <mdx-file> [output-org-file]');
    console.log('Examples:');
    console.log('  tsx scripts/mdx2org.ts content/docs/example.mdx');
    console.log('  tsx scripts/mdx2org.ts content/docs/example.mdx output.org');
    process.exit(1);
  }

  const mdxPath = args[0];
  const outputPath = args[1];

  await convertMdxFile(mdxPath, outputPath);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
