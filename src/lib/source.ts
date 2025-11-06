import { docs } from '@/.source';
import { loader } from 'fumadocs-core/source';
import { createMDXSource } from 'fumadocs-mdx/runtime/next';
import { createOrgSource } from '../../packages/fumadocs-org/dist/runtime/next/index.js';

// See https://fumadocs.vercel.app/docs/headless/source-api for more info
//export const source = loader({
//  baseUrl: '/docs',
//  source: createMDXSource(docs) as any,
//});
//
// Org-mode source
export const source = loader({
  baseUrl: '/docs',
  source: createOrgSource(docs) as any,
});
