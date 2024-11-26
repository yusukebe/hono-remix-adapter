import handle from 'hono-remix-adapter/cloudflare-workers@react-router'
import * as build from './build/server'
import { getLoadContext } from './load-context'
import app from './server'

export default handle(build, app, { getLoadContext })
