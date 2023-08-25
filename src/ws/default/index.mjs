// import arc from '@architect/functions'
// import data from '@begin/data'

export async function handler (event) {

  console.log('ws default event', event)

  /*
  // get the sender and their message
  let table = 'connections'
  let key = event.requestContext.connectionId
  let sender = await data.get({ table, key })
  let message = JSON.parse(event.body)

  // send to all connections 25 at a time
  let pages = data.page({ table, limit: 25 })

  for await (let connections of pages) {
    for (let connection of connections) {
      try {
        await arc.ws.send({
          id: connection.key,
          payload: {
            account: sender.account,
            text: message.text
          }
        })
      }
      catch (e) {
        // clean up bad connections
        if (e.code === 'GoneException') {
          let key = connection.key
          await data.destroy({ table, key })
        }
        else {
          console.error('swallowing error', e)
        }
      }
    }
  }*/

  return { statusCode: 200 }
}
