# Implement Conditional Search Mode for Dev and Static Build

## Overview

Configure the search functionality to use dynamic search during development (`npm run dev`) for faster iteration and real-time indexing, while maintaining static search for production builds to support static export deployment.

## Requirements

- Use dynamic search in development mode for instant feedback and real-time indexing
- Use static search in production/static builds for deployment compatibility
- Maintain full search functionality in both modes
- Ensure seamless transition between dev and production environments

## Implementation Steps

### Modify Search API Route

- [x] Update `src/app/api/search/route.ts` to use `staticGET` as `GET` with `dynamic = 'force-static'`
- [x] Ensure static export generates the search index correctly

### Update RootProvider Configuration

- [x] Modify `src/app/layout.tsx` to conditionally set search options based on `NODE_ENV`
- [x] Use dynamic search (no type specified) in development
- [x] Use static search (`type: 'static'`) in production

### Testing

- [x] Verify `npm run dev` starts without errors
- [x] Verify `npm run build:static` generates static search index
- [x] Test search functionality works in both development and static deployment

## Acceptance Criteria

- [x] Development server (`npm run dev`) provides dynamic search with instant results
- [x] Static build (`npm run build:static`) generates search index and supports search
- [x] No breaking changes to existing functionality
- [x] Code passes linting, type checking, and formatting checks

## Technical Details

The implementation leverages Next.js environment detection (`process.env.NODE_ENV`) to conditionally configure the search client:

- **Development**: Uses runtime API calls for dynamic indexing
- **Production**: Uses build-time generated static index for static export compatibility

## Fumadocs Search Research Integration

### Dynamic Search (GET)

In dynamic mode, the search server processes queries in real-time on the server. The implementation uses `src/app/api/search/route.ts` with:

- `dynamic = 'force-dynamic'` for runtime processing
- `revalidate = false` to prevent caching
- Real-time indexing from source on each request

### Static Search (staticGET)

In static mode, the search index is pre-built during build process using `src/app/api/search.static/route.ts` with:

- `dynamic = 'force-static'` for static generation
- `staticGET` method that exports pre-computed Orama JSON data
- Client-side search using downloaded index

### Orama JSON Creation

The Orama search index is generated during static builds when `staticGET` is called, creating a JSON file that clients download for local search functionality. This replaces the API endpoint in static deployments.

### Performance Implications

- **Dynamic Search**: Higher server load, real-time accuracy, suitable for development
- **Static Search**: Lower server costs, faster client-side search, requires rebuild on content changes

### Build Configuration

Static search requires `output: 'export'` in `next.config.mjs` for static export compatibility.

## Implementation Details

### Hybrid Search API Route

The `src/app/api/search/route.ts` implements a hybrid approach that serves both static and dynamic search:

- **No Query Parameter**: Returns `staticGET()` data (Orama JSON index) for client-side static search
- **With Query Parameter**: Processes search query dynamically using `GET(request)` for real-time results

### Static Search Route

A separate `src/app/api/search.static/route.ts` is created for static builds:

- Uses `dynamic = 'force-static'` for build-time generation
- Exports `staticGET` as `GET` to generate the search index JSON

### Post-build Script

`scripts/postbuild.js` renames the generated `search.static/route.js` to `search/route.js` in the static build output, ensuring the API endpoint is available at `/api/search` for static deployments.

### RootProvider Configuration

`src/app/layout.tsx` conditionally configures search:

- **Development**: No `type` specified, uses dynamic search via API calls
- **Production**: `type: 'static'` for client-side search with downloaded index

### Package.json Integration

Added `postbuild` script to automatically rename the static search route after build completion.

This implementation provides seamless search functionality across development and production environments while maintaining static export compatibility.

## Completion Status

[x] **COMPLETED** - Conditional search mode implemented successfully
