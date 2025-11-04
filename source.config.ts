import { defineConfig, defineCollections } from 'fumadocs-mdx/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { shikiLanguages } from '@/lib/shiki/languages';
import { bundledLanguages } from 'shiki';

// Options: https://fumadocs.vercel.app/docs/mdx/collections#define-docs
export const docs = defineCollections({
  type: 'doc',
  dir: ['content/docs', '.cache/docs'],
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    rehypeCodeOptions: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      langs: [...Object.values(bundledLanguages), ...shikiLanguages],
    },
  },
});
