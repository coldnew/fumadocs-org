// Re-export all schemas and utilities from fumadocs-mdx/config as aliases
export {
  frontmatterSchema,
  metaSchema,
  defineCollections,
  defineConfig,
  defineDocs,
  getDefaultMDXOptions,
  remarkInclude,
  // Type exports
  type AnyCollection,
  type BaseCollection,
  type CollectionSchema,
  type DefaultMDXOptions,
  type DocCollection,
  type DocsCollection,
  type GlobalConfig,
  type MetaCollection,
  type PostprocessOptions,
} from 'fumadocs-mdx/config';
