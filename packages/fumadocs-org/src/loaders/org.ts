import type { LoaderContext } from 'webpack';
import { convertOrgToMdx } from '@coldnew-blog/org2mdx';

export interface OrgLoaderOptions {
  isDev?: boolean;
  configPath?: string;
  outDir?: string;
}

export default async function loader(
  this: LoaderContext<OrgLoaderOptions>,
  source: string,
): Promise<void> {
  const callback = this.async();
  const filePath = this.resourcePath;

  try {
    // Convert org to MDX in-memory
    const conversionResult = await convertOrgToMdx(source, filePath);

    // Combine frontmatter and markdown into MDX content
    const mdxContent = `---\n${conversionResult.frontmatter}---\n${conversionResult.markdown}`;

    // Return the MDX content - it will be processed by fumadocs-mdx loader
    callback(null, mdxContent);
  } catch (error) {
    callback(error as Error);
  }
}
