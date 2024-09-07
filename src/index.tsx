import type { EntryContext } from '@remix-run/cloudflare'
// @ts-expect-error `react-dom/server.browser` is not typed
import { renderToReadableStream } from 'react-dom/server.browser'
import { Hono } from 'hono'
import { RemixServer } from '@remix-run/react'

export const handle =
  (userApp?: Hono) =>
  (
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    remixContext: EntryContext
  ) => {
    const app = new Hono<{
      Bindings: {
        responseStatusCode: number
        responseHeaders: Headers
        remixContext: EntryContext
      }
    }>()

    if (userApp) {
      app.route('/', userApp)
    }

    app.all('*', async (c) => {
      const request = c.req.raw
      const body = await renderToReadableStream(
        <RemixServer context={c.env.remixContext} url={request.url} />,
        {
          signal: request.signal,
          onError(error: unknown) {
            console.error(error)
            c.env.responseStatusCode = 500
          },
        }
      )
      c.header('Content-Type', 'text/html')
      return c.body(body, {
        status: c.env.responseStatusCode,
        headers: c.env.responseHeaders,
      })
    })

    return app.fetch(request, {
      remixContext,
      responseStatusCode,
      responseHeaders,
    })
  }
