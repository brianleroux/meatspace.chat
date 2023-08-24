import arc from '@architect/functions'
import data from '@begin/data'

export let handler = arc.http.async(fn)

async function fn (req) {
  console.log(req)

  /*
  // blow up on bad session
  if (!req.session.account)
    throw Error('invalid session')
    */

  // save the connection if its a good session; scale to zero
  await data.set({
    table: 'connections',
    key: req.requestContext.connectionId,
    account: req.session.account,
    ttl: 60 * 60 // 1 hour in seconds
  })

  return { statusCode: 200 }
}
