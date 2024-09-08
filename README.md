# hono-remix-adapter

`hono-remix-adapter` is an adapter for Hono between Remix. With this adapter, you can write Remix's `app/entry.server.tsx` as almost the same as the Hono app.

```ts
// app/entry.server.tsx
import { Hono } from 'hono'
import { handle } from 'hono-remix-adapter'

const app = new Hono()

app.get('/api', (c) => {
  return c.json({
    message: 'Hello Remix!',
  })
})

export default handle(app)
```

This means you can create API routes with Hono's syntax and use a lot of Hono's built-in middleware and third-party middleware.

## Install

```bash
npm i hono-remix-adapter hono @remix-run/react
```

## How to use

Just edit your `app/entry.server.tsx`.

```ts
// app/entry.server.tsx
import { handle } from 'hono-remix-adapter'

export default handle()
```

You can pass your Hono app.

```ts
// app/entry.server.tsx
import { handle } from 'hono-remix-adapter'
import { Hono } from 'hono'

const app = new Hono()

//...

export default handle(app)
```

## Don't use Auth middleware for Remix routes

We don't recommend using Auth middleware, e.g., Basic Auth Middleware for Remix routes. If the user accesses an unauthorized page first and next, the user moves to the authorized page, but it does not reject the user.

```ts
import { Hono } from 'hono'
import { basicAuth } from 'hono/basic-auth'
import { handle } from 'hono-remix-adapter'

const app = new Hono()

// NG!!
app.use(
  basicAuth({
    username: 'foo',
    password: 'bar',
  })
)

export default handle(app)
```

But it's okay to add Auth middleware to Hono's routes.

```ts
// OK
app.get(
  '/api',
  basicAuth({
    username: 'foo',
    password: 'bar',
  }),
  (c) => {
    return c.json({ message: 'Hello Remix!' })
  }
)
```

## Author

Yusuke Wada <https://github.com/yusukebe>

## License

MIT
