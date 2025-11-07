import type { NextConfig } from 'next';
import type { Configuration } from 'webpack';
import type {
  TurbopackLoaderOptions,
  TurbopackOptions,
} from 'next/dist/server/config-shared';
import { createMDX as createFumadocsMDX } from 'fumadocs-mdx/next';
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

/**
 * Enhanced createMDX that includes org file support via plugin
 * Reuses fumadocs-mdx's createMDX with our org support plugin
 */
export function createOrg(createOptions: CreateOrgOptions = {}) {
  const options = {
    configPath: createOptions.configPath ?? 'source.config.ts',
    outDir: createOptions.outDir ?? '.source',
  };

  // Use createMDX as base - our plugin handles org file support
  const withMDX = createFumadocsMDX({
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

// Add createMDX as alias for drop-in replacement
export const createMDX = createOrg;

// Re-export postInstall from fumadocs-mdx for compatibility
export { postInstall } from 'fumadocs-mdx/next';
