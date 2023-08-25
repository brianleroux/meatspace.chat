// import arc from '@architect/functions'
import data from '@begin/data'

const table = 'connections'

export default {

  /** saves connection info */
  async connect ({ account, connectionId }) {
    const ttl = 60 * 60 // 1 hour in seconds
    const key = connectionId
    await data.set([ {
      // given a connectionId lookup an account
      table,
      key,
      account,
      ttl
    }, {
      // given an account.id lookup all connections
      table: `${table}:accounts:${account.id}`,
      key,
      ttl
    } ])
  },

  /** cleans up on disconnection */
  async disconnect () {}
}
