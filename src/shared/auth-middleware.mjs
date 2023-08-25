import channels from './channels.mjs'
import link from './github-signin-link.mjs'

/** ensure session.account and valid channel */
export default async function auth (req) {
  if (req.session.account) {
    let key = req.params.key
    let channel = await channels.find({ key })
    if (channel) {
      req.channel = channel
    }
    else {
      return {
        code: 404,
        html: notfound(key)
      }
    }
  }
  else {
    return {
      location: '/'
    }
  }
}

function notfound (key) {
  let href = link({ text: 'Sign in with GitHub and start a new channel' })
  return `could not find /channels/${key}; ${href}`
}
