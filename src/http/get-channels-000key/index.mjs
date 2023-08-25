import arc from '@architect/functions'
import notfound from './notfound.mjs'
import channels from '@architect/shared/channels.mjs'

// use built-in architect middleware
export let handler = arc.http(auth, chat)

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
  function sort (a, b) {
    return new Date(a.created) - new Date(b.created)
  }
  function fmt (m) {
    return `<article>
      <h3>${m.account.name || m.account.login || 'anon'}</h3>
      <img src="${m.account.avatar}" width=40>
      <p>${m.message}</p><a>${new Date(m.created).toISOString()}</a>
    </article>`
  }
  const messages = channel.messages.sort(sort).map(fmt).join('')
  const wss = process.env.ARC_ENV === 'testing' ? process.env.ARC_WSS_URL : 'wss://meatspace.chat/_wss/'
  return {
    html: `
      <header>
        <form action=/logout method=post>
          <button><img width=40 src=${account.avatar}> Sign out</button>
        </form>
        <h1>${channel.name}</h1>
      </header>

      <main>${messages}</main>

      <form id=postform action=/channels/${channel.key} method=post>
        <input type=text id=message name=message autofocus>
        <button>post</button>
      </form>

      <details> 
        <summary>Invite link</summary>
        <input type=text value="${invite}">
      </details>
      <details>
        <summary>Debug info</summary>
        <pre>${JSON.stringify(req.channel, null, 2)}</pre>
      </details>

      <script>
        window.WS_URL = '${wss}'
      </script>
      <script type=module src=${arc.static('index.mjs')}></script>

    `
  }
}
