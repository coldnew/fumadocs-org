import { defineDocs, defineConfig } from 'fumadocs-mdx/config';
import { orgRemarkPlugin } from '@/lib/org-mode';

// Options: https://fumadocs.vercel.app/docs/mdx/collections#define-docs
export const docs = defineDocs({
  dir: 'content/docs',
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [orgRemarkPlugin],
  },
});
