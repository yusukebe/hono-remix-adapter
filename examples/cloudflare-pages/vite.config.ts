// vite.config.ts
import adapter from '@hono/vite-dev-server/cloudflare'
import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from '@remix-run/dev'
import serverAdapter from 'hono-remix-adapter/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { getLoadContext } from './load-context'

export default defineConfig({
  plugins: [
    remixCloudflareDevProxy(),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    serverAdapter({
      adapter,
      getLoadContext,
      entry: 'server/index.ts',
    }),
    tsconfigPaths(),
  ],
})
