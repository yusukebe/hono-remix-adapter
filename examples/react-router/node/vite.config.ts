import { reactRouter } from '@react-router/dev/vite'
import serverAdapter from 'hono-remix-adapter/vite@react-router'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { getLoadContext } from './load-context'

export default defineConfig({
  plugins: [
    reactRouter(),
    serverAdapter({
      getLoadContext,
      entry: './server/index.ts',
    }),
    tsconfigPaths(),
  ],
})
