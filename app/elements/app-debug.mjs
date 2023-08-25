export default function debug ({ html, state }) {
  return html`<footer>
    <details>
      <summary>${ state.attrs.text || 'debug' }</summary>
      <pre>${ JSON.stringify(state, null, 2) }</pre>
    </details>
  </footer>`
}
