import { handle } from './index'
import { describe, expect, it } from 'vitest'
import type { EntryContext } from '@remix-run/cloudflare'
import { Hono } from 'hono'

describe('Basic', () => {
  it('Should return 200 response with the mock context', async () => {
    const app = new Hono()
    app.use('*', async (c, next) => {
      await next()
      c.header('X-Powered-By', 'Remix and Hono')
    })
    const handler = handle(app)
    const request = new Request('http://example.com')
    const res = await handler(request, 200, new Headers(), createMockEntryContext())
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('Hello World!')
    expect(res.headers.get('X-Powered-By')).toBe('Remix and Hono')
  })
})

function createMockEntryContext(): EntryContext {
  return {
    manifest: {
      routes: {
        // @ts-expect-error Types is not enough
        index: {
          id: 'index',
          path: '/',
        },
      },
    },
    routeModules: {
      index: {
        default: () => 'Hello World!',
      },
    },
    staticHandlerContext: {
      matches: [
        // @ts-expect-error Types is not enough
        {
          route: {
            id: 'index',
          },
        },
      ],
      // @ts-expect-error Types is not enough
      location: {
        pathname: '/',
      },
    },
    staticContext: {
      loadContext: {},
    },
    // @ts-expect-error Types is not enough
    future: {
      v3_fetcherPersist: true,
      v3_relativeSplatPath: true,
      v3_throwAbortReason: true,
    },
  }
}
