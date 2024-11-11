import type { PlatformProxy } from 'wrangler'

interface Env {
  MY_VAR: string
}

type GetLoadContextArgs = {
  request: Request
  context: {
    cloudflare: Omit<PlatformProxy<Env>, 'dispose' | 'caches' | 'cf'> & {
      caches: PlatformProxy<Env>['caches'] | CacheStorage
      cf: Request['cf']
    }
  }
}

declare module '@remix-run/cloudflare' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface AppLoadContext extends ReturnType<typeof getLoadContext> {
    // This will merge the result of `getLoadContext` into the `AppLoadContext`
    extra: string
  }
}

export function getLoadContext({ context }: GetLoadContextArgs) {
  return {
    ...context,
    extra: 'stuff',
  }
}
