import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/plugin.ts',
    'src/next/index.ts',
    'src/loaders/org.ts',
    'src/runtime/next/index.ts',
    'src/bin.ts',
  ],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
});
