import arc from '@architect/functions'
import notfound from './notfound.mjs'
import channels from '@architect/shared/channels.mjs'

// use built-in architect middleware
export let handler = arc.http(auth, chat)

/** ensure session.account and valid channel */
async function auth (req) {
  if (req.session.account) {
    let key = req.params.key
    let channel = await channels.read({ key })
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

/** render channel interface */
async function chat (req) {
  const account = req.session.account
  const channel = req.channel
  const invite = `https://meatspace.chat?invite=${channel.key}`
  return {
    html: `
      <form action=/logout method=post>
        <button><img width=40 src=${account.avatar}> Sign out</button>
      </form>
      <h1>${channel.name}</h1>
      <details> 
        <summary>Invite link</summary>
        <input type=text value="${invite}">
      </details>
      <pre>${JSON.stringify(req, null, 2)}</pre>

    `
  }
}
