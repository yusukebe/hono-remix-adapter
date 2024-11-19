import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/vite-plugin.ts',
    'src/dev.ts',
    'src/handlers/cloudflare-pages.ts',
    'src/handlers/cloudflare-workers.ts',
    'src/handlers/node/index.ts',
    'src/remix.ts',
  ],
  external: [
    '../server',
    'virtual:remix/server-build',
    'hono',
    '@remix-run/cloudflare',
    'vite',
    '@remix-run/node',
  ],
  format: 'esm',
  splitting: false,
  dts: true,
})
