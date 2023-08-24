import data from '@begin/data'

const table = 'channels'

export default {

  /** create a channel */
  async create (account) {
    let channel = await data.set({
      table,
      name: `${account.login || account.name || 'unknown'}'s channel`,
      account
    })
    // keep track of channels a given account has joined
    await this.join({ account, channel })
    return channel.key
  },

  /** adds an account to a channel */
  async join ({ account, channel }) {
    await data.set([ {
      table: `${table}:${account.id}`,
      key:  channel.key
    }, {
      table: `${table}:${channel.key}:accounts`,
      key: account.id
    } ])
  },

  /** read a channel */
  async read (params) {
    // read(channel):channel
    if (params.key)
      return data.get({ table, key: params.key })
    // read(account):channel
    if (params.id) {
      let joined = await data.get({
        table: `${table}:${params.id}`
      })
      if (joined.length > 0) {
        return data.get({ table, key: joined.channels[0] })
      }
    }
    throw Error('invalid_params')
  },

  /** list channels given account is in */
  async list ({ id }) {
    let res = await data.get({
      table: `${table}:${id}`
    })
    return Array.isArray(res) ? res : []
  },

  update () {},
  destroy () {},
}
