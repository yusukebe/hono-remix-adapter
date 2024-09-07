# hono-remix-adapter

`hono-remix-adapter` is an adapter for Hono between Remix. With this adapter, you can write Remix's `app/entry.server.tsx` as almost the same as the Hono app.

```ts
// app/entry.server.tsx
import { handle } from 'hono-remix-adapter'
import { Hono } from 'hono'

const app = new Hono()

app.use(async (c, next) => {
  await next()
  c.header('X-Powered-By', 'Remix and Hono')
})

export default handle(app)
```

This means that you can use a lot of Hono's built-in and third-party middleware. If you want to add Basic Authentication at the endpoints, just write the following.

```ts
import { handle } from 'hono-remix-adapter'
import { Hono } from 'hono'
import { basicAuth } from 'hono/basic-auth'

const app = new Hono()

app.use(
  '/admin/*',
  basicAuth({
    username: 'admin',
    password: 'pass',
  })
)

export default handle(app)
```

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

## Author

Yusuke Wada <https://github.com/yusukebe>

## License

MIT
