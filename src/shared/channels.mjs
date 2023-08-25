import arc from '@architect/functions'
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
      // get channels by account
      table: `${table}:${account.id}`,
      key:  channel.key,
      channel
    }, {
      // get accounts by channel
      table: `${table}:${channel.key}:accounts`,
      key: account.id,
      account,
    } ])
  },

  /** read a channel shallow */
  async read ({ key }) {
    if (key)
      return data.get({ table, key })
    throw Error('invalid_params')
  },

  /** read a channel deep */
  async find ({ key }) {
    if (key) {
      let [ meta, messages, members ] = await Promise.all([
        data.get({
          table, key
        }),
        data.get({
          table: `${table}:${key}:posts`,
        }),
        data.get({
          table: `${table}:${key}:accounts`,
        })
      ])
      // if we found nothing return false
      if (!meta) return false
      // if we found the channel merge/clean up deep data
      delete meta.table
      meta.messages = messages.map(m => {
        delete m.table
        delete m.key
        return m
      })
      meta.members = members.map(a => a.account)
      return meta
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

  /** post a message to a channel */
  async post ({ channel, account, message }) {
    // write the message
    let msg = await data.set({
      table: `${table}:${channel}:posts`,
      created: Date.now(),
      account,
      message
    })
    // let SNS deal with notifying web socket connections
    await arc.events.publish({
      name: 'message-posted',
      payload: { channel, message: msg }
    })
    return msg
  },

  /** fired by SNS publish above */
  async posted (event) {
    // console.log(JSON.stringify(event, null, 2))
    // get all channel members
    let members = await data.get({
      table: `channels:${event.channel}:accounts`
    })
    for (let account of members.map(a => a.account)) {
      // members could have more than one browser tab open!
      // get members in the room and find out all their connectionIds
      let connections = await data.get({
        table: `connections:accounts:${account.id}`
      })
      // loop thru sending messages
      for (let connection of connections) {
        // don't let some failures block other successes
        try {
          await arc.ws.send({
            id: connection.key,
            payload: {
              message: event
            }
          })
        }
        catch (e) {
          if (e.name != 'GoneException') {
            // TODO cleanup failed connection here w connection.key
            console.log(e)
          }
        }
      }
    }
  }

// end of channels
}
