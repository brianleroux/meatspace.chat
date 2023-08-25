import arc from '@architect/functions'
import auth from '@architect/shared/auth-middleware.mjs'

/** render channel interface */
export let handler = arc.http(auth, async function chat (req) {

  const testing = process.env.ARC_ENV === 'testing'
  const endpoint = testing ? process.env.ARC_WSS_URL : 'wss://meatspace.chat/_wss/'
  const account = req.session.account
  const channel = req.channel
  const invite = `https://meatspace.chat?invite=${channel.key}`
  const messages = channel.messages.map(function fmt (m) {
    return `<article>
      <h3>${m.account.name || m.account.login || 'anon'}</h3>
      <img src="${m.account.avatar}" width=40>
      <p>${m.message}</p><a>${new Date(m.created).toISOString()}</a>
    </article>`
  }).join('')

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
        window.WS_URL = '${endpoint}'
      </script>
      <script type=module src=${arc.static('index.mjs')}></script>
    `
  }
})
