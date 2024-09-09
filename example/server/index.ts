// server/index.ts
import { Hono } from 'hono'
import { poweredBy } from 'hono/powered-by'

const app = new Hono()

app.use(poweredBy())

app.get('/api', (c) => {
  return c.json({
    message: 'Hello',
  })
})

export default app
