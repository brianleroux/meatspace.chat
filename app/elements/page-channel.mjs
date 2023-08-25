export default function channel ({ html, state }) {

  let { account, channel, invite, endpoint } = state.store
  let messages = channel.messages.map(m => {
    return `
      <message-element 
        key=${m.key} 
        name="${m.account.name || m.account.login || 'anon'}"
        avatar="${m.account.avatar}"
        message="${m.message}"
        created="${new Date(m.created).toISOString()}"></message-element>`
  }).join('')

  return html`<app-layout title="${channel.name}">
    <header slot=header>
      <form action=/logout method=post>
        <button><img width=40 src=${account.avatar}> Sign out</button>
      </form>
      <h1>${channel.name}</h1>
      <details> 
        <summary>Invite link</summary>
        <input type=text value="${invite}">
      </details>
    </header>

    ${messages}

    <nav slot=footer>
      <form id=postform action=/channels/${channel.key} method=post>
        <input type=text id=message name=message autofocus>
        <button>post</button>
      </form>

      <script>
        window.WS_URL = '${endpoint}'
      </script>
      <script type=module src=/_public/index.mjs></script>
    </nav>
  </app-layout>`
}
