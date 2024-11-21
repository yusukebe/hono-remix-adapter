import type { LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

export const loader = (args: LoaderFunctionArgs) => {
  const extra = args.context.extra
  const url = args.context.url
  return { extra, url }
}

export default function Index() {
  const { extra, url } = useLoaderData<typeof loader>()
  return (
    <div>
      <h1>Remix and Hono</h1>
      <h2>URL is {url}</h2>
      <h3>Extra is {extra}</h3>
    </div>
  )
}
