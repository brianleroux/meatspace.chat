export default function authed ({ html, state }) {
  let channels = state.store.channels.map(c => {
    return `<li><a href=/channels/${c.key}>${c.name}</a></li>`
  }).join('')
  return html`<app-layout>
    <nav>${channels}</nav>
  </app-layout>`
}

