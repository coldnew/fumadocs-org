import type { NextConfig } from 'next';
import type { Configuration } from 'webpack';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  createMDX as createFumadocsMDX,
  postInstall as mdxPostInstall,
} from 'fumadocs-mdx/next';
import { readFile, writeFile, readdir } from 'node:fs/promises';

export interface CreateOrgOptions {
  configPath?: string;
  outDir?: string;
}

const defaultPageExtensions = ['mdx', 'md', 'jsx', 'js', 'tsx', 'ts', 'org'];

function getOrgLoaderPath(): string {
  if (typeof require !== 'undefined') {
    try {
      return require.resolve('fumadocs-org/loader-org');
    } catch {
      // Fallback to path resolution
    }
  }
  const esmMeta = typeof import.meta !== 'undefined' ? import.meta : undefined;
  if (esmMeta && esmMeta.url) {
    const moduleDir = path.dirname(fileURLToPath(esmMeta.url));
    const packageDir = path.resolve(moduleDir, '..', '..');
    return path.resolve(packageDir, 'loader-org.cjs');
  }
  if (typeof __dirname !== 'undefined') {
    return path.resolve(__dirname, 'loader-org.cjs');
  }
  return path.resolve(process.cwd(), 'loader-org.cjs');
}

async function addOrgFilesToServer(options: { outDir: string }) {
  const serverPath = path.join(process.cwd(), '.source', 'server.ts');
  const docsDir = path.join(process.cwd(), 'content/docs');

  try {
    const files = await readdir(docsDir);
    const orgFiles = files.filter((f) => f.endsWith('.org'));

    if (orgFiles.length === 0) return;

    let serverContent = await readFile(serverPath, 'utf-8');

    const hasOrgImports = orgFiles.some((file) =>
      serverContent.includes(`"${file}"`),
    );

    if (hasOrgImports) {
      console.log('[ORG] Org files already in server.ts, skipping update');
      return;
    }

    const orgImports: string[] = [];
    for (let i = 0; i < orgFiles.length; i++) {
      const file = orgFiles[i];
      orgImports.push(
        `import * as __fd_org_${i} from "../content/docs/${file}?collection=docs"`,
      );
    }

    const importBlock = orgImports.join('\n');
    serverContent = serverContent.replace(
      '// @ts-nocheck',
      `// @ts-nocheck\n${importBlock}`,
    );

    const orgEntries = orgFiles
      .map((file, i) => `  "${file}": __fd_org_${i}`)
      .join(',\n');

    serverContent = serverContent.replace(
      /(await create\.docs\("docs", "content\/docs", \{\}, \{)([^}]+)(\}\);)/s,
      (_, prefix, existing, suffix) => {
        return `${prefix}${existing.replace(/,\s*$/, '')}, // org files\n  ${orgEntries}\n${suffix}`;
      },
    );

    await writeFile(serverPath, serverContent, 'utf-8');
    console.log(
      `[ORG] Added ${orgFiles.length} org files to .source/server.ts`,
    );
  } catch (error) {
    console.error('[ORG] Error updating server.ts:', error);
  }
}

export async function postInstall(options: CreateOrgOptions = {}) {
  const normalizedOptions = {
    configPath: options.configPath ?? 'source.config.ts',
    outDir: options.outDir ?? '.source',
  };

  try {
    await mdxPostInstall(normalizedOptions);
  } catch (error) {
    console.warn(
      '[ORG] postInstall warning (continuing anyway):',
      error instanceof Error ? error.message : error,
    );
  }

  await addOrgFilesToServer(normalizedOptions);
}

export function createOrg(createOptions: CreateOrgOptions = {}) {
  const options = {
    configPath: createOptions.configPath ?? 'source.config.ts',
    outDir: createOptions.outDir ?? '.source',
  };

  const orgLoaderPath = getOrgLoaderPath();

  const withMDX = createFumadocsMDX({
    configPath: options.configPath,
    outDir: options.outDir,
  });

  return (nextConfig: NextConfig = {}): NextConfig => {
    const mdxConfig = withMDX(nextConfig);

    return {
      ...mdxConfig,
      pageExtensions: mdxConfig.pageExtensions ?? defaultPageExtensions,
      webpack: (config: Configuration, webpackOptions) => {
        config = mdxConfig.webpack?.(config, webpackOptions) ?? config;

        config.module ||= {};
        config.module.rules ||= [];

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
                loader: orgLoaderPath,
                options: {
                  configPath: options.configPath,
                  outDir: options.outDir,
                  isDev: process.env.NODE_ENV === 'development',
                },
              },
            ],
            as: '*.mdx',
          },
        },
      },
    };
  };
}

export const createMDX = createOrg;
