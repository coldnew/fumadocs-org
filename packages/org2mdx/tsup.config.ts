import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  target: 'es2020',
  tsconfig: './tsconfig.json',
  external: [
    'gray-matter',
    'html-to-jsx-transform',
    'rehype-remark',
    'remark-gfm',
    'remark-mdx',
    'remark-parse',
    'remark-stringify',
    'uniorg',
    'uniorg-parse',
    'uniorg-rehype',
    'unified',
    'unist-util-visit',
  ],
});
