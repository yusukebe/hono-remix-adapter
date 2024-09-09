import { Hono } from 'hono'
import { staticAssets } from 'remix-hono/cloudflare'
import { remix } from 'remix-hono/handler'
import { handle } from 'hono/cloudflare-pages'

export const handler = (serverBuild: any, userApp?: Hono<any, any, any>) => {
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
        getLoadContext(c) {
          return {
            cloudflare: {
              env: c.env,
            },
          }
        },
      })(c, next)
    }
  )
  return handle(app)
}

export default handler
