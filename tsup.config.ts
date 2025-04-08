import { defineConfig } from 'tsup';

export default defineConfig([
    {
      entry: { index: 'src/index.ts' },
      format: 'esm',
      outDir: 'dist',
      dts: false,
      clean: false,
      shims: true,
      external: ['tailwindcss'],
      outExtension: () => ({ js: '.js' }),
    },
    {
      entry: { index: 'src/index.ts' },
      format: 'cjs',
      outDir: 'dist',
      dts: true,
      clean: false,
      shims: true,
      external: ['tailwindcss'],
      outExtension: () => ({ js: '.cjs' }),
    },
  ]);