// functions/[[path]].ts
import handle from 'hono-remix-adapter/cloudflare-pages'
import { getLoadContext } from 'load-context'
import * as build from '../build/server'
import server from '../server'

export const onRequest = handle(build, server, { getLoadContext })
