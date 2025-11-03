# 0019: Merge Sources with MDX Priority

## Description

Modify `source.config.ts` to define a single source using `defineCollections` with `dir: ['content/docs', '.cache/docs']` to merge content from both directories. Use `createMDXSource` in `src/lib/source.ts` to create the Fumadocs source with baseUrl '/docs'. File priority: `content/docs` files take precedence over `.cache/docs` versions due to directory order.

## Why defineCollections instead of defineDocs

`defineDocs` only accepts a single `dir` string, while `defineCollections` accepts `dir` as a string or string array, allowing merging of multiple directories in one collection.

## Tasks

- Update `source.config.ts` to use `defineCollections` with dir array for merging
- Modify `src/lib/source.ts` to use `createMDXSource(docs)` with baseUrl '/docs'
- Test that content/docs .mdx files override cached versions
- Verify Fumadocs serves merged content correctly under /docs

## Acceptance Criteria

- Fumadocs serves merged content from content/docs and .cache/docs
- content/docs .mdx files have priority over .cache/docs versions
- /docs and subpages work correctly
- No breaking changes to existing functionality
