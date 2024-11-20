// server/index.ts
import { Hono } from 'hono'

const app = new Hono<{
  Bindings: {
    MY_VAR: string
  }
}>()

app.use(async (c, next) => {
  await next()
  c.header('X-Powered-By', 'Remix and Hono')
})

app.get('/api', (c) => {
  return c.json({
    message: 'Hello',
    var: c.env.MY_VAR,
  })
})

export default app
