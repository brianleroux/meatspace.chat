import arc from '@architect/functions'
import connections from '@architect/shared/connections.mjs'

export let handler = arc.http(connect)

async function connect (req) {
  // blow up on bad session
  if (!req.session.account)
    throw Error('invalid session')
  // persist connection info
  await connections.connect({
    connectionId: req.requestContext.connectionId,
    account: req.session.account
  })
  // always keep it 200
  return { code: 200 }
}
