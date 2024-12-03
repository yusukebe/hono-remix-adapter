# hono-remix-adapter

`hono-remix-adapter` is a set of tools for adapting between Hono and React Router. It is composed of a Vite plugin and handlers that enable it to support platforms like Cloudflare Workers and Node.js. You just create Hono app, and it will be applied to your React Router app.

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
npm i hono-remix-adapter hono
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

## Cloudflare Workers

To support Cloudflare Workers and Cloudflare Pages, add the adapter in `@hono/vite-dev-server` for development.

```ts
// vite.config.ts
import adapter from '@hono/vite-dev-server/cloudflare'
import serverAdapter from 'hono-remix-adapter/vite'

export default defineConfig({
  plugins: [
    // ...
    remix(),
    serverAdapter({
      adapter, // Add Cloudflare adapter
      entry: 'server/index.ts',
    }),
  ],
})
```

To deploy your app to Cloudflare Workers, you can write the following handler on `worker.ts`:

```ts
// worker.ts
import handle from 'hono-remix-adapter/cloudflare-workers'
import * as build from './build/server'
import server from './server'

export default handle(build, server)
```

Specify `worker.ts` in your `wrangler.toml`:

```toml
name = "example-cloudflare-workers"
compatibility_date = "2024-11-06"
main = "./worker.ts"
assets = { directory = "./build/client" }
```

## Cloudflare Pages

To deploy your app to Cloudflare Pages, you can write the following handler on `functions/[[path]].ts`:

```ts
// functions/[[path]].ts
import handle from 'hono-remix-adapter/cloudflare-pages'
import * as build from '../build/server'
import server from '../server'

export const onRequest = handle(build, server)
```

## Node.js

If you want to run your app on Node.js, you can use `hono-remix-adapter/node`. Write `main.ts`:

```ts
// main.ts
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import handle from 'hono-remix-adapter/node'
import * as build from './build/server'
import { getLoadContext } from './load-context'
import server from './server'

server.use(
  serveStatic({
    root: './build/client',
  })
)

const handler = handle(build, server, { getLoadContext })

serve({ fetch: handler.fetch, port: 3010 })
```

Run `main.ts` with [`tsx`](https://github.com/privatenumber/tsx):

```bash
tsx main.ts
```

Or you can compile to a pure JavaScript file with `esbuild` with the command below:

```bash
esbuild main.ts --bundle --outfile=main.mjs --platform=node --target=node16.8 --format=esm --banner:js='import { createRequire as topLevelCreateRequire } from "module"; const require = topLevelCreateRequire(import.meta.url);'
```

## `getLoadContext`

If you want to add extra context values when you use Remix routes, like in the following use case:

```ts
// app/routes/_index.tsx
import type { LoaderFunctionArgs } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'

export const loader = ({ context }) => {
  return { extra: context.extra }
}

export default function Index() {
  const { extra } = useLoaderData<typeof loader>()
  return <h1>Extra is {extra}</h1>
}
```

First, create the `getLoadContext` function and export it:

```ts
// load-context.ts
import type { AppLoadContext } from 'react-router'
import type { PlatformProxy } from 'wrangler'

type Cloudflare = Omit<PlatformProxy, 'dispose'>

declare module 'react-router' {
  interface AppLoadContext {
    cloudflare: Cloudflare
    extra: string
  }
}

type GetLoadContext = (args: {
  request: Request
  context: { cloudflare: Cloudflare }
}) => AppLoadContext

export const getLoadContext: GetLoadContext = ({ context }) => {
  return {
    ...context,
    extra: 'stuff',
  }
}
```

Then import the `getLoadContext` and add it to the `serverAdapter` as an argument in your `vite.config.ts`:

```ts
// vite.config.ts
import adapter from '@hono/vite-dev-server/cloudflare'
import { reactRouter } from '@react-router/dev'
import serverAdapter from 'hono-remix-adapter/vite'
import { defineConfig } from 'vite'
import { getLoadContext } from './load-context'

export default defineConfig({
  plugins: [
    // ...
    reactRouter(),
    serverAdapter({
      adapter,
      getLoadContext,
      entry: 'server/index.ts',
    }),
  ],
})
```

For Cloudflare Workers, you can add it to the `handler` function:

```ts
// worker.ts
import handle from 'hono-remix-adapter/cloudflare-workers'
import * as build from './build/server'
import { getLoadContext } from './load-context'
import app from './server'

export default handle(build, app, { getLoadContext })
```

You can also add it for Cloudflare Pages:

```ts
// functions/[[path]].ts
import handle from 'hono-remix-adapter/cloudflare-pages'
import { getLoadContext } from 'load-context'
import * as build from '../build/server'
import server from '../server'

export const onRequest = handle(build, server, { getLoadContext })
```

This way is almost the same as [Remix](https://remix.run/docs/en/main/guides/vite#augmenting-load-context).

### Getting Hono context

You can get the Hono context in Remix routes. For example, you can pass the value with `c.set()` from your Hono instance in the `server/index.ts`:

```ts
// server/index.ts
import { Hono } from 'hono'

const app = new Hono<{
  Variables: {
    message: string
  }
}>()

app.use(async (c, next) => {
  c.set('message', 'Hi from Hono')
  await next()
})

export default app
```

In the React Router route, you can get the context from `args.context.hono.context`:

```ts
// app/routes/_index.tsx
import { Router } from "./types/_index"

export const loader = ({ context }) => {
  const message = args.context.hono.context.get('message')
  return { message }
}

export default function Index({ loaderData }:Route.ComponentProps) {
  const { message } = loaderData
  return <h1>Message is {message}</h1>
}
```

To enable type inference, config the `load-context.ts` like follows:

```ts
// load-context.ts
import type { AppLoadContext } from 'react-router'
import type { Context } from 'hono'
import type { PlatformProxy } from 'wrangler'

type Env = {
  Variables: {
    message: string
  }
}

type Cloudflare = Omit<PlatformProxy, 'dispose'>

declare module 'react-router' {
  interface AppLoadContext {
    cloudflare: Cloudflare
    hono: {
      context: Context<Env>
    }
    extra: string
  }
}

type GetLoadContext = (args: {
  request: Request
  context: {
    cloudflare: Cloudflare
    hono: { context: Context<Env> }
  }
}) => AppLoadContext

export const getLoadContext: GetLoadContext = ({ context }) => {
  return {
    ...context,
    extra: 'stuff',
  }
}
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
