export default function home ({ html, state }) {
  // if there is an invite code always show the invite screen
  let invite = state.store.invite
  if (invite) {
    return html`<page-home-invite>${invite}</page-home-invite>`
  }
  // if not invite but authenticated shows a list of channels
  let account = state.store.account
  if (account) {
    return html`<page-home-authenticated></page-home-authenticated>`
  }
  // if no invite or authenticated invite the user to create a channel
  return html`<page-home-unauthenticated></page-home-unauthenticated>`
}
