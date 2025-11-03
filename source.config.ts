import { defineDocs, defineConfig } from 'fumadocs-mdx/config';
import { orgRemarkPlugin } from '@/lib/org-mode';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// Options: https://fumadocs.vercel.app/docs/mdx/collections#define-docs
export const docs = defineDocs({
  dir: 'content/docs',
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [orgRemarkPlugin, remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});
