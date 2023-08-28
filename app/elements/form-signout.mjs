export default function signout ({ html, state }) {
  return html`<form action=/logout method=post>
    <button><img width=40 src=${state.attrs.src}> Sign out</button>
  </form>`
}
