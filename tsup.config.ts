import { defineConfig } from 'tsup'

export default defineConfig((options) => {
  return {
    entry: ['src/vite-plugin.ts', 'src/dev.ts', 'src/cloudflare-pages.ts'],
    external: ['../server', 'virtual:remix/server-build', 'hono', '@remix-run/cloudflare', 'vite'],
    format: 'esm',
    dts: true,
  }
})
