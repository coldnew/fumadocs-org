import {
  defineConfig,
  defineCollections,
} from 'fumadocs-mdx/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// Options: https://fumadocs.vercel.app/docs/mdx/collections#define-docs
export const docs = defineCollections({
  type: 'doc',
  dir: ['content/docs', '.cache/docs'],
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});
