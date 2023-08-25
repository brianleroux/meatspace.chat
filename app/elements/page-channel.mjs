export default function channel ({ html, state }) {
  let { account, channel, invite, endpoint } = state.store
    /*`<article>
      <h3>${m.account.name || m.account.login || 'anon'}</h3>
      <img src="${m.account.avatar}" width=40>
      <p>${m.message}</p><a>${new Date(m.created).toISOString()}</a>
    </article>`
  }).join('')*/
  return html`<app-layout>
    <header slot=header>
      <form action=/logout method=post>
        <button><img width=40 src=${account.avatar}> Sign out</button>
      </form>
      <h1>${channel.name}</h1>
    </header>

    <section></section>

    <form id=postform action=/channels/${channel.key} method=post>
      <input type=text id=message name=message autofocus>
      <button>post</button>
    </form>

    <details> 
      <summary>Invite link</summary>
      <input type=text value="${invite}">
    </details>

    <script>
      window.WS_URL = '${endpoint}'
    </script>
    <script type=module src=/_public/index.mjs></script>
  </app-layout>`
}


