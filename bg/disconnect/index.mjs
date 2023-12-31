import connections from '@architect/shared/connections.mjs'

export async function handler (event) {
  let key = event.requestContext.connectionId
  await connections.destroy({ key })
  return { statusCode: 200 }
}
