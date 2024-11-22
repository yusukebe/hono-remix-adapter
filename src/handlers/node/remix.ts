import type { AppLoadContext } from '@remix-run/node'
import type { Context } from 'hono'

export type GetLoadContext = (args: {
  request: Request
}) => AppLoadContext | Promise<AppLoadContext>

export const createGetLoadContextArgs = (c: Context) => {
  return {
    context: {},
    request: c.req.raw,
  }
}
