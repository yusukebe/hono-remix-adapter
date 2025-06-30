import { Hono } from 'hono'
import { createGetLoadContextArgs, defaultGetLoadContext } from './react-router'
import type { GetLoadContext } from './react-router'

type Options = {
  getLoadContext: GetLoadContext
}

export const handle = (userApp?: Hono, options?: Options) => {
  const app = new Hono()

  if (userApp) {
    app.route('/', userApp)
  }

  app.all('*', async (c) => {
    // @ts-expect-error it's not typed
    const build = await import('virtual:react-router/server-build')
    const { createRequestHandler } = await import('react-router')
    const handler = createRequestHandler(build, 'development')

    const getLoadContext = options?.getLoadContext ?? defaultGetLoadContext
    const args = createGetLoadContextArgs(c)

    const reactRouterContext = getLoadContext(args)
    const resolvedContext = reactRouterContext instanceof Promise ? await reactRouterContext : reactRouterContext

    const response = await handler(c.req.raw, resolvedContext)

    if (response.headers.get('content-type')?.includes('text/html')) {
      response.headers.set('transfer-encoding', 'chunked')
    }

    return response
  })

  return app
}

export default handle
