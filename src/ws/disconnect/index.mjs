import arc from '@architect/functions'
import data from '@begin/data'

// clean up bad connections
export async function handler (event) {
  try {
    let table = 'connections'
    let key = event.requestContext.connectionId
    await data.destroy({ table, key })
  }
  catch (e) {
    console.error('swallowing', e)
  }
  return { statusCode: 200 }
}
