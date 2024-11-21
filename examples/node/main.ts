// main.ts
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import handle from 'hono-remix-adapter/node'
import * as build from './build/server'
import { getLoadContext } from './load-context'
import server from './server'

server.use(
  serveStatic({
    root: './build/client',
  })
)

const handler = handle(build, server, { getLoadContext })

serve({ fetch: handler.fetch, port: 3010 })
