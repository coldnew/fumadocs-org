import { defineConfig, defineDocs } from 'fumadocs-org';
import { z } from 'zod';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { bundledLanguages } from 'shiki';
import { shikiLanguages } from '@/lib/shiki/languages';

// Custom language for math blocks (plain text highlighting)
const mathLanguage = {
  name: 'math',
  scopeName: 'text.math',
  repository: {},
  patterns: [],
};

// Frontmatter validation schema for docs
const docsSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  published: z.boolean().optional().default(true),
  date: z.string().datetime().optional(),
  tags: z.array(z.string()).optional(),
});

// Options: https://fumadocs.vercel.app/docs/mdx/collections#define-docs
export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: docsSchema,
  },
});

export default defineConfig({
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
