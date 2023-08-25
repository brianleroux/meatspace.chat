import data from '@begin/data'

const table = 'connections'
const ttl = 60 * 60 // 1 hour in seconds

export default {

  /** saves connection info */
  async connect ({ account, key }) {
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

  /** if key passed return account for connectionId; if id passed return connectionIds for account */
  async read ({ key, id }) {
    if (key)
      return data.get({ table, key })
    if (id)
      return data.get({ table: `${table}:accounts:${id}` })
    throw Error('invalid_params')
  },

  /** best effort cleanup connections */
  async destroy ({ key, id }) {
    try {
      if (key && id ) {
        await Promise.all([
          data.destroy({ table, key }),
          data.destroy({ table: `${table}:accounts:${id}`, key })
        ])
      }
      if (key) {
        await data.destroy({ table, key })
      }
    }
    catch (e) {
      console.log('destroy failed with', e)
    }
  }
//
}
