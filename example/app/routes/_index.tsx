import type { LoaderFunctionArgs } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'

type Cloudflare = {
  env: {
    MY_VAR: string
  }
  cf: IncomingRequestCfProperties
  ctx: {
    waitUntil: Function
    passThroughOnException: Function
  }
  caches: object
}

export const loader = ({ context }: LoaderFunctionArgs) => {
  const { env, cf, ctx, caches } = context.cloudflare as Cloudflare
  return {
    var: env.MY_VAR,
    cf,
    ctx,
    caches,
  }
}

export default function Index() {
  const data = useLoaderData<typeof loader>()
  return (
    <div>
      <h1>Remix and Hono</h1>
      <h2>Var is {data.var}</h2>
      <h3>
        {data.cf ? 'cf,' : ''}
        {data.ctx ? 'ctx,' : ''}
        {data.caches ? 'caches are available' : ''}
      </h3>
    </div>
  )
}
