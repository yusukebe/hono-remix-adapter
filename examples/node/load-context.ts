type GetLoadContextArgs = {
  request: Request
}

declare module '@remix-run/node' {
  interface AppLoadContext extends ReturnType<typeof getLoadContext> {
    url: string
    extra: string
  }
}

export function getLoadContext(args: GetLoadContextArgs) {
  return {
    url: args.request.url,
    extra: 'stuff',
  }
}
