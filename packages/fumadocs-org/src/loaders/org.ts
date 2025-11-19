import type { LoaderContext } from 'webpack';
import { convertOrgToMdx } from '../core/index';
import matter from 'gray-matter';
import path from 'path';

export interface OrgLoaderOptions {
  isDev?: boolean;
  configPath?: string;
  outDir?: string;
}

/**
 * Validation error for frontmatter schema issues
 */
class ValidationError extends Error {
  public title: string;
  public issues: Array<{ path?: string[]; message: string }>;

  constructor(
    message: string,
    issues: Array<{ path?: string[]; message: string }>,
  ) {
    super(
      `${message}:\n ${issues.map((issue) => `  ${issue.path?.join('.') || '*'}: ${issue.message}`).join('\n')}`,
    );
    this.title = message;
    this.issues = issues;
  }

  toStringFormatted(): string {
    try {
      const picocolors = require('picocolors');
      return [
        picocolors.bold(`[ORG] ${this.title}:`),
        ...this.issues.map((issue) =>
          picocolors.redBright(
            `- ${picocolors.bold(issue.path?.join('.') || '*')}: ${issue.message}`,
          ),
        ),
      ].join('\n');
    } catch {
      // Fallback if picocolors is not available
      return `[ORG] ${this.title}:\n${this.issues.map((issue) => `  - ${issue.path?.join('.') || '*'}: ${issue.message}`).join('\n')}`;
    }
  }
}

/**
 * Validate data against a schema (supports both Zod and Standard Schema)
 */
async function validate(
  schema: any,
  data: any,
  context: { source: string; path: string },
  errorMessage: string,
): Promise<any> {
  // Handle dynamic schema functions
  if (typeof schema === 'function' && !('~standard' in schema)) {
    schema = schema(context);
  }

  // Handle Standard Schema V1
  if ('~standard' in schema) {
    const result = await schema['~standard'].validate(data);
    if (result.issues) {
      throw new ValidationError(errorMessage, result.issues);
    }
    return result.value;
  }

  // Handle Zod schemas
  if (
    typeof schema === 'object' &&
    schema &&
    typeof schema.parse === 'function'
  ) {
    try {
      return await schema.parseAsync(data);
    } catch (error: any) {
      if (error.errors) {
        const issues = error.errors.map((err: any) => ({
          path: err.path,
          message: err.message,
        }));
        throw new ValidationError(errorMessage, issues);
      }
      throw error;
    }
  }

  // No validation needed
  return data;
}

/**
 * Get collection configuration from fumadocs-mdx config file
 */
async function getCollectionConfig(
  configPath: string,
  filePath: string,
): Promise<{ schema?: any; type?: string } | null> {
  try {
    // Try to load the config file using a more robust approach
    let configModule;
    try {
      // First try direct import (for development)
      configModule = await import(configPath);
    } catch (importError) {
      // If that fails, try with file:// protocol and absolute path
      const absoluteConfigPath = path.resolve(process.cwd(), configPath);
      configModule = await import(`file://${absoluteConfigPath}`);
    }
    const config = configModule.default || configModule;

    // Parse file path to determine collection
    const absolutePath = filePath;
    const relativePath = absolutePath
      .replace(process.cwd(), '')
      .replace(/^\//, '');

    // Try to find matching collection
    if (config.collections) {
      for (const [name, collection] of Object.entries(config.collections)) {
        const coll = collection as any;

        // Check if file matches collection pattern
        const dirs = Array.isArray(coll.dir) ? coll.dir : [coll.dir];
        const matchesDir = dirs.some((dir: string) =>
          relativePath.startsWith(dir),
        );

        if (matchesDir) {
          if (coll.type === 'doc') {
            return { schema: coll.schema, type: 'doc' };
          } else if (coll.type === 'docs' && coll.docs) {
            return { schema: coll.docs.schema, type: 'docs' };
          } else if (coll.type === 'meta') {
            return { schema: coll.schema, type: 'meta' };
          }
        }
      }
    }

    return null;
  } catch (error) {
    // If config loading fails, return null to skip validation
    console.warn(`[ORG] Could not load config from ${configPath}:`, error);
    return null;
  }
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
  const { configPath } = this.getOptions();

  // If async is available, use async mode
  if (callback) {
    // Async execution for webpack
    (async () => {
      try {
        // Convert org to MDX first
        const conversionResult = await convertOrgToMdx(source, filePath);

        // Extract frontmatter for validation
        const { data: frontmatterData } = matter(conversionResult.frontmatter);

        // Apply schema validation if config is available
        if (configPath) {
          const collectionConfig = await getCollectionConfig(
            configPath,
            filePath,
          );

          if (collectionConfig?.schema) {
            try {
              const validatedData = await validate(
                collectionConfig.schema,
                frontmatterData,
                { source, path: filePath },
                `invalid frontmatter in ${filePath}`,
              );

              // Rebuild frontmatter with validated data
              const validatedFrontmatter = matter.stringify('', validatedData);

              // Combine validated frontmatter and markdown into MDX content
              const mdxContent = `${validatedFrontmatter}\n${conversionResult.markdown}`;
              callback(null, mdxContent);
              return;
            } catch (error) {
              if (error instanceof ValidationError) {
                callback(new Error(error.toStringFormatted()));
                return;
              }
              throw error;
            }
          }
        }

        // No validation needed, combine frontmatter and markdown
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
