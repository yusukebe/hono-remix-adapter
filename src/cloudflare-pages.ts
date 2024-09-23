import type { ServerBuild } from '@remix-run/cloudflare'
import { createRequestHandler } from '@remix-run/cloudflare'
import { Hono } from 'hono'
import { handle } from 'hono/cloudflare-pages'
import { createMiddleware } from 'hono/factory'
import { staticAssets } from 'remix-hono/cloudflare'
import { createGetLoadContextArgs, defaultGetLoadContext } from './remix'
import type { GetLoadContext } from './remix'

interface RemixMiddlewareOptions {
  build: ServerBuild
  mode?: 'development' | 'production'
  getLoadContext: GetLoadContext
}

function remix({ mode, build, getLoadContext }: RemixMiddlewareOptions) {
  return createMiddleware(async (c) => {
    const requestHandler = createRequestHandler(build, mode)
    const args = createGetLoadContextArgs(c)

    const loadContext = getLoadContext(args)
    return await requestHandler(
      c.req.raw,
      loadContext instanceof Promise ? await loadContext : loadContext
    )
  })
}

type Options = {
  getLoadContext: GetLoadContext
}

// Relaxing the type definitions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handler = (serverBuild: any, userApp?: Hono<any, any, any>, options?: Options) => {
  const app = new Hono()

  if (userApp) {
    app.route('/', userApp)
  }

  app.use(
    async (c, next) => {
      return staticAssets()(c, next)
    },
    async (c, next) => {
      return remix({
        build: serverBuild,
        mode: 'production',
        getLoadContext: options?.getLoadContext ?? defaultGetLoadContext,
      })(c, next)
    }
  )
  return handle(app)
}

export default handler
