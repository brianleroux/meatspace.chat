import arc from '@architect/functions'
import xss from 'xss'
import auth from '@architect/shared/auth-middleware.mjs'
import channels from '@architect/shared/channels.mjs'
import mdi from 'markdown-it'
const md = new mdi()

export let handler = arc.http(auth, async function post (req) {
  // write the post
  let post = await channels.post({
    channel: req.params.key,
    account: req.session.account,
    message: md.render(xss(req.body.message.substr(0, 240)))
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
})
