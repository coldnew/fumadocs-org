# Enable Static Export for Fumadocs

## Overview

Configure the Fumadocs documentation site to support static export with full search functionality, allowing it to be deployed as a static website without requiring a Node.js server. This is achieved through build-time search indexing using Orama.

## Requirements

- Enable Next.js static export functionality
- Configure the build to output static HTML files
- Implement static search using build-time indexing with Orama
- Ensure all documentation pages are properly generated
- Maintain instant search functionality in static deployment

## Implementation Steps

### Configure Next.js Static Export

- [x] Update `next.config.mjs` to enable static export with `output: 'export'`
  ```javascript
  output: 'export', // Enables static site generation
  trailingSlash: true,
  images: { unoptimized: true },
  ```
- [x] Configure trailing slash and other static export options
- [x] Test that the build generates static files correctly

### Implement Static Search

- [ ] Configure search API route with `staticGET` for build-time indexing using Orama
- [ ] Update `RootProvider` to use `type: 'static'` search mode
- [ ] Ensure `@orama/orama` dependency is installed and configured
- [ ] Verify that search index is generated as static JSON during build
- [ ] Test that client-side search works in static deployment

### Configure Static Search

- [ ] Create/update `src/app/api/search/route.ts` with static search endpoint:

  ```typescript
  import { source } from '@/lib/source';
  import { createFromSource } from 'fumadocs-core/search/server';

  export const dynamic = 'force-static';
  export const { staticGET: GET } = createFromSource(source);
  ```

- [ ] Update `RootProvider` in layout to enable static search:
  ```typescript
  <RootProvider
    search={{
      options: {
        type: 'static',
        api: '/api/search',
      },
    }}
  >
  ```
- [ ] Ensure `@orama/orama` is installed for client-side search engine
- [ ] Configure basePath and assetPrefix for production deployment

### Update Build Scripts

- [ ] Ensure `npm run build` works with static export configuration
- [ ] Verify that all pages are properly pre-rendered
- [ ] Test that the generated static files are functional
- [ ] Confirm search index is built as static JSON file

### Documentation Updates

- [x] Update AGENTS.md with static export information
- [x] Document deployment options for static sites
- [x] Note limitations (no search, no API routes)

## Acceptance Criteria

- [ ] `npm run build` completes successfully with static export
- [ ] All documentation pages are generated as static HTML
- [ ] Search functionality works in static deployment with instant results
- [ ] Search index is generated as static JSON file during build
- [ ] Site can be served from any static hosting service
- [ ] No server-side functionality required for browsing or search
- [ ] Code passes linting, type checking, and formatting checks

## Deployment Options

After static export is enabled, the site can be deployed to:

- **Netlify**: Drag and drop the `out/` folder
- **Vercel**: Deploy the `out/` folder as a static site
- **GitHub Pages**: Push the `out/` folder to a `gh-pages` branch
- **AWS S3 + CloudFront**: Upload static files to S3
- **Any static hosting service**

## Limitations

- **No dynamic API routes**: Only static-generated routes are supported
- **Static content only**: No server-side rendering or runtime data fetching
- **Build-time only**: All content must be available at build time

## Completion Status

[ ] **IN PROGRESS** - Static export is configured, but search functionality needs to be implemented using build-time indexing.
