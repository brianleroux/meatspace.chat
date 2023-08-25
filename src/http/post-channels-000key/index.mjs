import arc from '@architect/functions'
import channels from '@architect/shared/channels.mjs'

async function auth (req) {
  if (!req.session.account) {
    return {
      location: '/'
    }
  }
}

async function post (req) {
  let post = await channels.post({
    channel: req.params.key,
    account: req.session.account,
    message: req.body.message
  })
  if (req.headers['x-fetching']) {
    return {
      json: post
    }
  }
  return {
    location: `/channels/${req.params.key}`
  }
}

export let handler = arc.http(auth, post)
