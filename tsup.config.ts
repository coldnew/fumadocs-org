import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/config/index.ts',
    'src/core/index.ts',
    'src/next/index.ts',
    'src/loaders/org.ts',
    'src/bin.ts',
  ],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  noExternal: ['gray-matter'],
});
