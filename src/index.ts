// Main entry point for fumadocs-org package
export * from './core';
export * from './next';

// Re-export schemas from config (these are not in core)
export { frontmatterSchema, metaSchema, remarkInclude } from './config';
