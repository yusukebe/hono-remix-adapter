# hono-remix-adapter

`hono-remix-adapter` is a set of tools for adapting between Hono and Remix. It is composed of a Vite plugin and handlers that enable it to support platforms like Cloudflare Pages. You can create an Hono app, and it will be applied to your Remix app.

```ts
// server/index.ts
import { Hono } from 'hono'

const app = new Hono()

app.use(async (c, next) => {
  await next()
  c.header('X-Powered-By', 'Remix and Hono')
})

app.get('/api', (c) => {
  return c.json({
    message: 'Hello',
  })
})

export default app
```

This means you can create API routes with Hono's syntax and use a lot of Hono's built-in middleware and third-party middleware.

> [!WARNING]
>
> `hono-remix-adapter` is currently unstable. The API may be changed without announcement in the future.

## Install

```bash
npm i hono-remix-adapter
```

## How to use

Edit your `vite.config.ts`:

```ts
// vite.config.ts
import serverAdapter from 'hono-remix-adapter/vite'

export default defineConfig({
  plugins: [
    // ...
    remix(),
    serverAdapter({
      entry: 'server/index.ts',
    }),
  ],
})
```

Write your Hono app:

```ts
// server/index.ts
import { Hono } from 'hono'

const app = new Hono()

//...

export default app
```

## Cloudflare Pages

To support Cloudflare Pages, add the adapter in `@hono/vite-dev-server` for development.

```ts
// vite.config.ts
import adapter from '@hono/vite-dev-server/cloudflare'
import serverAdapter from 'hono-remix-adapter/vite'

export default defineConfig({
  plugins: [
    // ...
    remix(),
    serverAdapter({
      adapter, // Add Cloudflare Pages adapter
      entry: 'server/index.ts',
    }),
  ],
})
```

To deploy it, you can write the following handler on `functions/[[path]].ts`:

```ts
// functions/[[path]].ts
import handle from 'hono-remix-adapter/cloudflare-pages'
import * as build from '../build/server'
import server from '../server'

export const onRequest = handle(build, server)
```

## Auth middleware for Remix routes

If you want to add Auth Middleware, e.g. Basic Auth middleware, please be careful that users can access the protected pages with SPA tradition. To prevent this, add a `loader` to the page:

```ts
// app/routes/admin
export const loader = async () => {
  return { props: {} }
}
```

## Related works

- https://github.com/sergiodxa/remix-hono
- https://github.com/yusukebe/hono-and-remix-on-vite

## Author

Yusuke Wada <https://github.com/yusukebe>

## License

MIT
