import { createMiddleware } from 'hono/factory'
import { createRequestHandler } from 'react-router'
import type { ServerBuild } from 'react-router'
import { createGetLoadContextArgs } from './remix'
import type { GetLoadContext } from './remix'

interface RemixMiddlewareOptions {
  build: ServerBuild
  mode?: 'development' | 'production'
  getLoadContext: GetLoadContext
}

export const remix = ({ mode, build, getLoadContext }: RemixMiddlewareOptions) => {
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
