import { defineConfig, defineCollections } from 'fumadocs-mdx/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { shikiLanguages } from '@/lib/shiki/languages';
import { bundledLanguages } from 'shiki';
import { orgSupportPlugin } from '@/packages/fumadocs-org/src/plugin';

// Custom language for math blocks (plain text highlighting)
const mathLanguage = {
  name: 'math',
  scopeName: 'text.math',
  repository: {},
  patterns: [],
};

// Options: https://fumadocs.vercel.app/docs/mdx/collections#define-docs
//export const docs = defineCollections({
//  type: 'doc',
//  dir: 'content/docs',
//});

// Org-mode collections
export const docs = defineCollections({
  type: 'doc',
  dir: 'content/docs',
  files: ['**/*.{md,mdx,org}'],
});

export default defineConfig({
  plugins: [orgSupportPlugin()],
  mdxOptions: {
    remarkPlugins: [remarkMath],
    rehypePlugins: (v) => [rehypeKatex, ...v],
    rehypeCodeOptions: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      langs: [
        ...Object.values(bundledLanguages),
        ...shikiLanguages,
        mathLanguage,
      ],
    },
  },
});
