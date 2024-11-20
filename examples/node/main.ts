// main.ts
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import handle from 'hono-remix-adapter/node'
import * as build from './build/server'
import server from './server'

server.use(
  serveStatic({
    root: './build/client',
  })
)

serve(handle(build, server))
