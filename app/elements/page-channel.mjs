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
      <form-signout src=${account.avatar}></form-signout>
      <details> 
        <summary>Invite link</summary>
        <input type=text value="${invite}">
      </details>
    </header>
    
    <channel-messages></channel-messages>
    ${messages}

    <nav slot=footer>
      <form-post-message channel=${channel.key}></form-post-message>
      <script>
        window.WS_URL = '${endpoint}'
      </script>
      <script type=module src=/_public/browser/channel.mjs></script>
    </nav>
  </app-layout>`
}
