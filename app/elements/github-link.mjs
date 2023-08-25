export default function ghlink ({ html, state }) {
  return html`<a href="${state.store.invite || state.store.github}">${ state.attrs.text || 'Sign in with Github' }</a></p>`
}

