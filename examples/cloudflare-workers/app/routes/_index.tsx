import type { Route } from './+types/_index'

export const loader = (args: Route.LoaderArgs) => {
  const extra = args.context.extra
  const cloudflare = args.context.cloudflare
  const myVarInVariables = args.context.hono.context.get('MY_VAR_IN_VARIABLES')
  return { cloudflare, extra, myVarInVariables }
}

export default function Index({ loaderData }: Route.ComponentProps) {
  const { cloudflare, extra, myVarInVariables } = loaderData
  return (
    <div>
      <h1>Remix and Hono</h1>Ï<h2>Var is {cloudflare.env.MY_VAR}</h2>
      <h3>
        {cloudflare.cf ? 'cf,' : ''}
        {cloudflare.ctx ? 'ctx,' : ''}
        {cloudflare.caches ? 'caches are available' : ''}
      </h3>
      <h4>Extra is {extra}</h4>
      <h5>Var in Variables is {myVarInVariables}</h5>
    </div>
  )
}
