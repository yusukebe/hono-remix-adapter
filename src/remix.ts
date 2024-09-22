import type { AppLoadContext } from '@remix-run/cloudflare'
import type { Context } from 'hono'

export type GetLoadContext = (args: {
  request: Request
  context: {
    // Relaxing the type definition
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cloudflare: any
  }
}) => AppLoadContext

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const defaultGetLoadContext = ({ context }: any) => {
  return {
    ...context,
  }
}

export const createGetLoadContextArgs = (c: Context) => {
  return {
    context: {
      cloudflare: {
        env: c.env,
        cf: c.req.raw.cf,
        ctx: {
          ...c.executionCtx,
        },
        caches,
      },
    },
    request: c.req.raw,
  }
}
