import { docs } from '@/.source';
import { loader } from 'fumadocs-core/source';

// See https://fumadocs.vercel.app/docs/headless/source-api for more info
// Org-mode source is handled by enhanced defineDocs in source.config.ts
// Use the toFumadocsSource() method like the working example
export const source = loader({
  baseUrl: '/docs',
  source: (docs as any).toFumadocsSource(),
});
