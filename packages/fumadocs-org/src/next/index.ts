import type { NextConfig } from 'next';
import type { Configuration } from 'webpack';
import type {
  TurbopackLoaderOptions,
  TurbopackOptions,
} from 'next/dist/server/config-shared';
import { createMDX, postInstall as mdxPostInstall } from 'fumadocs-mdx/next';
import { orgSupportPlugin } from '../plugin';

export interface CreateOrgOptions {
  /**
   * Path to source configuration file
   */
  configPath?: string;

  /**
   * Directory for output files
   *
   * @defaultValue '.source'
   */
  outDir?: string;
}

const defaultPageExtensions = ['mdx', 'md', 'jsx', 'js', 'tsx', 'ts', 'org'];

export function createOrg(createOptions: CreateOrgOptions = {}) {
  const options = {
    configPath: createOptions.configPath ?? 'source.config.ts',
    outDir: createOptions.outDir ?? '.source',
  };

  // Use createMDX as base with org support plugin
  const withMDX = createMDX({
    configPath: options.configPath,
    outDir: options.outDir,
  });

  return (nextConfig: NextConfig = {}): NextConfig => {
    // Get MDX config first
    const mdxConfig = withMDX(nextConfig);

    return {
      ...mdxConfig,
      pageExtensions: mdxConfig.pageExtensions ?? defaultPageExtensions,
      webpack: (config: Configuration, webpackOptions) => {
        // Get MDX webpack config
        config = mdxConfig.webpack?.(config, webpackOptions) ?? config;

        // Add org loader rules
        config.module ||= {};
        config.module.rules ||= [];

        // ORG files - chain org loader then MDX loader
        // Loaders are applied right-to-left, so org loader (rightmost) runs first
        config.module.rules.push({
          test: /\.org$/,
          use: [
            webpackOptions.defaultLoaders.babel,
            {
              loader: 'fumadocs-mdx/loader-mdx',
              options: {
                configPath: options.configPath,
                outDir: options.outDir,
                isDev: process.env.NODE_ENV === 'development',
              },
            },
            {
              loader: 'fumadocs-org/loader-org',
              options: {
                configPath: options.configPath,
                outDir: options.outDir,
                isDev: process.env.NODE_ENV === 'development',
              },
            },
          ],
        });

        return config;
      },
      turbopack: {
        ...mdxConfig.turbopack,
        rules: {
          ...mdxConfig.turbopack?.rules,
          '*.org': {
            loaders: [
              {
                loader: 'fumadocs-mdx/loader-mdx',
                options: {
                  configPath: options.configPath,
                  outDir: options.outDir,
                  isDev: process.env.NODE_ENV === 'development',
                } as TurbopackLoaderOptions,
              },
              {
                loader: 'fumadocs-org/loader-org',
                options: {
                  configPath: options.configPath,
                  outDir: options.outDir,
                  isDev: process.env.NODE_ENV === 'development',
                } as TurbopackLoaderOptions,
              },
            ],
            as: '*.js',
          },
        },
      },
    };
  };
}

async function initOrgSupport(options: { configPath: string; outDir: string }) {
  try {
    console.log('[ORG] Initializing org support...');

    // Then scan for org files and manually add them to the generated source
    const { glob } = await import('tinyglobby');
    const { readFile, writeFile } = await import('node:fs/promises');
    const { join } = await import('node:path');

    const orgFiles = await glob('content/**/*.org', {
      cwd: process.cwd(),
    });

    if (orgFiles.length > 0) {
      console.log(`[ORG] Found ${orgFiles.length} org files:`, orgFiles);

      // Run regular MDX postInstall first to generate base source structure
      console.log('[ORG] Running MDX postInstall...');
      await mdxPostInstall(options.configPath, options.outDir);
      console.log('[ORG] MDX postInstall completed');

      // Read the generated index file
      const indexPath = join(options.outDir, 'index.ts');
      let indexContent = '';
      try {
        indexContent = await readFile(indexPath, 'utf-8');
      } catch {
        console.error('[ORG] Could not read generated index file');
        return;
      }

      // Add org file imports and exports
      const imports: string[] = [];
      const exports: string[] = [];

      for (const [i, orgFile] of orgFiles.entries()) {
        const importId = `d_org_${i}`;
        const relativePath = orgFile;

        imports.push(
          `import * as ${importId} from "../${orgFile}?collection=docs"`,
        );
        exports.push(
          `{ info: ${JSON.stringify({ path: relativePath.replace('.org', ''), fullPath: orgFile })}, data: ${importId} }`,
        );
      }

      // Find the docs export and add org files to the existing array
      const docsExportRegex =
        /(export const docs = _runtime\.doc<typeof _source\.docs>\(\[)(\]);/;
      const match = indexContent.match(docsExportRegex);

      if (match) {
        const before = match[1];
        const after = match[2];
        const orgExports = exports.length > 0 ? `, ${exports.join(', ')}` : '';

        // Replace the empty array with our org files
        indexContent = indexContent.replace(
          docsExportRegex,
          `export const docs = _runtime.doc<typeof _source.docs>([${before}${orgExports}${after}]);`,
        );

        // Add imports at the top after existing imports
        const importInsertPoint = indexContent.indexOf('// @ts-nocheck');
        if (importInsertPoint !== -1) {
          const afterImports =
            indexContent.indexOf('\n', importInsertPoint) + 1;
          indexContent = [
            indexContent.slice(0, afterImports),
            imports.join('\n'),
            '\n',
            indexContent.slice(afterImports),
          ].join('');
        }

        await writeFile(indexPath, indexContent, 'utf-8');
        console.log('[ORG] Updated source files to include org files');
      }
    }
  } catch (error) {
    console.error('[ORG] Failed to initialize org support:', error);
  }
}

// Export postInstall for external use
export async function postInstall(
  configPath?: string,
  outDir?: string,
): Promise<void> {
  await initOrgSupport({
    configPath: configPath ?? 'source.config.ts',
    outDir: outDir ?? '.source',
  });
}
