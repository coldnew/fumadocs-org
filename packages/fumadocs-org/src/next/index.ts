import type { NextConfig } from 'next';
import type { Configuration } from 'webpack';
import type { TurbopackOptions } from 'next/dist/server/config-shared';

export interface CreateOrgOptions {
  /**
   * Path to source configuration file
   */
  configPath?: string;

  /**
   * Directory for output files
   */
  outDir?: string;
}

const defaultPageExtensions = ['org', 'mdx', 'md', 'jsx', 'js', 'tsx', 'ts'];

export function createOrg(createOptions: CreateOrgOptions = {}) {
  const options = applyDefaults(createOptions);
  const isDev = process.env.NODE_ENV === 'development';

  return (nextConfig: NextConfig = {}): NextConfig => {
    const turbopack: TurbopackOptions = {
      ...nextConfig.turbopack,
      rules: {
        ...nextConfig.turbopack?.rules,
        '*.org': {
          loaders: [
            {
              loader: 'fumadocs-org/loader-org',
              options: {
                isDev,
                configPath: options.configPath,
                outDir: options.outDir,
              },
            },
            {
              loader: 'fumadocs-mdx/loader-mdx',
              options: {
                isDev,
                configPath: options.configPath,
                outDir: options.outDir,
              },
            },
          ],
          as: '*.js',
        },
      },
    };

    return {
      ...nextConfig,
      turbopack,
      pageExtensions: nextConfig.pageExtensions ?? defaultPageExtensions,
      webpack: (config: Configuration, webpackOptions) => {
        config.module ||= {};
        config.module.rules ||= [];

        // Add org loader that converts org to MDX, then chains to fumadocs-mdx
        config.module.rules.push({
          test: /\.org$/,
          use: [
            webpackOptions.defaultLoaders.babel,
            {
              loader: 'fumadocs-org/loader-org',
              options: {
                isDev,
                configPath: options.configPath,
                outDir: options.outDir,
              },
            },
            {
              loader: 'fumadocs-mdx/loader-mdx',
              options: {
                isDev,
                configPath: options.configPath,
                outDir: options.outDir,
              },
            },
          ],
        });

        return nextConfig.webpack?.(config, webpackOptions) ?? config;
      },
    };
  };
}

function applyDefaults(options: CreateOrgOptions): Required<CreateOrgOptions> {
  return {
    outDir: options.outDir ?? '.source',
    configPath: options.configPath ?? 'fumadocs.config.ts',
  };
}
