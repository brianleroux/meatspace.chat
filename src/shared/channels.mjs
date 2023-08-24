import data from '@begin/data'

const table = 'channels'

export default {

  /** create a channel */
  async create (account) {
    let channel = await data.set({
      table,
      name: `${account.login || account.name || 'unknown'}'s channel`,
      accounts: [ account.id ]
    })
    // keep track of channels a given account has joined
    await data.set({
      table: `${table}:${account.id}`,
      key: 'channels',
      channels: [ channel.key ]
    })
    return channel.key
  },

  /** read a channel */
  async read (params) {
    // read(channel):channel
    if (params.key)
      return data.get({ table, key: params.key })
    // read(account):channel
    if (params.id) {
      let joined = await data.get({
        table: `${table}:${params.id}`,
        key: 'channels'
      })
      if (joined.channels && joined.channels.length >= 1) {
        return data.get({ table, key: joined.channels[0] })
      }
    }
    throw Error('invalid_params')
  },

  update () {},
  destroy () {},
}
