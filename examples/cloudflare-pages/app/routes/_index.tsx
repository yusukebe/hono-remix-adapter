import type { LoaderFunctionArgs } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import logoDark from '/logo-dark.png?inline'

export const loader = (args: LoaderFunctionArgs) => {
  const extra = args.context.extra
  const cloudflare = args.context.cloudflare
  const myVarInVariables = args.context.hono.context.get('MY_VAR_IN_VARIABLES')
  const isWaitUntilDefined = !!cloudflare.ctx.waitUntil
  return { cloudflare, extra, myVarInVariables, isWaitUntilDefined }
}

export default function Index() {
  const { cloudflare, extra, myVarInVariables, isWaitUntilDefined } = useLoaderData<typeof loader>()
  return (
    <div>
      <h1>Remix and Hono</h1>
      <h2>Var is {cloudflare.env.MY_VAR}</h2>
      <h3>
        {cloudflare.cf ? 'cf,' : ''}
        {cloudflare.ctx ? 'ctx,' : ''}
        {cloudflare.caches ? 'caches are available' : ''}
      </h3>
      <h4>Extra is {extra}</h4>
      <h5>Var in Variables is {myVarInVariables}</h5>
      <h6>waitUntil is {isWaitUntilDefined ? 'defined' : 'not defined'}</h6>
      <img src={logoDark} alt='Remix' />
    </div>
  )
}
