import { Hono } from 'hono'
import { handle } from 'hono/cloudflare-pages'
import { remix, staticAssets } from '../middleware'
import { defaultGetLoadContext } from '../remix'
import type { GetLoadContext } from '../remix'

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
