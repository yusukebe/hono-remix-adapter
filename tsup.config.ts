import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/vite-plugin.ts',
    'src/dev.ts',
    'src/handlers/cloudflare-pages.ts',
    'src/handlers/cloudflare-workers.ts',
    'src/handlers/node/index.ts',
    'src/remix.ts',
    'src/react-router/vite-plugin.ts',
    'src/react-router/dev.ts',
    'src/react-router/handlers/cloudflare-pages.ts',
    'src/react-router/handlers/cloudflare-workers.ts',
    'src/react-router/handlers/node/index.ts',
    'src/react-router/remix.ts',
  ],
  external: [
    '../server',
    'virtual:remix/server-build',
    'hono',
    '@remix-run/cloudflare',
    'vite',
    '@remix-run/node',
    'react-router',
    '@react-router/cloudflare',
    'virtual:react-router/server-build'
  ],
  format: 'esm',
  splitting: false,
  dts: true,
})
