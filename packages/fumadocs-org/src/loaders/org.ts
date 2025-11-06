import type { LoaderContext } from 'webpack';
import { convertOrgToMdx } from '@coldnew-blog/org2mdx';

export interface OrgLoaderOptions {
  isDev?: boolean;
  configPath?: string;
  outDir?: string;
}

export default function loader(
  this: LoaderContext<OrgLoaderOptions>,
  source: string,
): string | void {
  // Check if loader context is properly initialized
  if (!this || typeof this.async !== 'function') {
    throw new Error(
      'Loader context is not properly initialized. Missing this.async method.',
    );
  }

  const callback = this.async();

  const filePath = this.resourcePath;

  // If async is available, use async mode
  if (callback) {
    // Async execution for webpack
    (async () => {
      try {
        const conversionResult = await convertOrgToMdx(source, filePath);

        // Combine frontmatter and markdown into MDX content
        // conversionResult.frontmatter already includes --- markers
        const mdxContent = `${conversionResult.frontmatter}\n${conversionResult.markdown}`;
        callback(null, mdxContent);
      } catch (error) {
        callback(error as Error);
      }
    })();
    return; // Return undefined when using callback
  } else {
    // Synchronous execution for Turbopack
    try {
      // Convert org to MDX synchronously - this won't work with async functions
      // For now, throw an error to indicate the limitation
      throw new Error(
        'Synchronous execution not supported for org-mode conversion. Please use webpack instead of Turbopack.',
      );
    } catch (error) {
      throw error as Error;
    }
  }
}
