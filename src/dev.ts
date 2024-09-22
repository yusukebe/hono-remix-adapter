import type { AppLoadContext } from '@remix-run/cloudflare'
import { Hono } from 'hono'

export const handle = (userApp?: Hono) => {
  const app = new Hono()

  if (userApp) {
    app.route('/', userApp)
  }

  app.all('*', async (c) => {
    // @ts-expect-error it's not typed
    const build = await import('virtual:remix/server-build')
    const { createRequestHandler } = await import('@remix-run/cloudflare')
    const handler = createRequestHandler(build, 'development')
    const remixContext = {
      cloudflare: {
        env: c.env,
        cf: c.req.raw.cf,
        ctx: {
          ...c.executionCtx,
        },
        caches,
      },
    } as unknown as AppLoadContext
    return handler(c.req.raw, remixContext)
  })
  return app
}

export default handle
