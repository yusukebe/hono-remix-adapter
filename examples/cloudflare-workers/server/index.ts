// server/index.ts
import { Hono } from 'hono'

const app = new Hono<{
  Bindings: {
    MY_VAR: string
  },
  Variables: {
    'hono-context': string
  },
}>()

app.use(async(c, next) => {
  c.set('hono-context', 'hono-context')
  await next()
  c.header('X-Powered-By', 'Remix and Hono')
})

app.get('/api', (c) => {
  return c.json({
    message: 'Hello',
    var: c.env.MY_VAR
  })
})


export default app
