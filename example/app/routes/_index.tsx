import type { LoaderFunctionArgs } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'

export const loader = ({ context }: LoaderFunctionArgs) => {
  const { env } = context.cloudflare as { env: { MY_VAR: string} }
  return {
    var: env.MY_VAR
  }
}

export default function Index() {
  const data = useLoaderData<typeof loader>()
  return (
    <div>
      <h1>Remix and Hono</h1>
      <h2>Var is {data.var}</h2>
    </div>
  )
}
