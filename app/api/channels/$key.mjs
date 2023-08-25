import xss from 'xss'
import mdi from 'markdown-it'
import channels from '../../../shared/channels.mjs'
import link from '../../../shared/github.mjs'

/** ensure session.account and valid channel */
async function auth (req) {
  if (req.session.account) {
    let key = req.params.key
    let channel = await channels.find({ key })
    if (channel) {
      req.channel = channel
    }
    else {
      return {
        code: 404,
        json: { key, github: link() }
      }
    }
  }
  else {
    return {
      location: '/'
    }
  }
}

/** channel chat interface */
async function chat (req) {
  const testing = process.env.ARC_ENV === 'testing'
  const endpoint = testing ? process.env.ARC_WSS_URL : 'wss://meatspace.chat/_wss/'
  const account = req.session.account
  const channel = req.channel
  const invite = `https://meatspace.chat?invite=${channel.key}`
  return {
    json: { channel, account, invite, endpoint }
  }
}

/** post a message to channel chat */
async function msg (req) {
  // write the post
  let post = await channels.post({
    channel: req.params.key,
    account: req.session.account,
    message: (new mdi()).render(xss(req.body.message.substr(0, 240)))
  })
  // if fetch request return json
  if (req.headers['x-fetching']) {
    return {
      json: post
    }
  }
  // otherwise redirect back
  return {
    location: `/channels/${req.params.key}`
  }
}

export let get = [ auth, chat ]
export let post = [ auth, msg ]
