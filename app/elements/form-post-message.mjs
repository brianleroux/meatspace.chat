export default function form ({ html, state }) {
  return html`<form id=postform action=/channels/${state.attrs.channel} method=post>
      <input type=text id=message name=message autofocus>
      <button>post</button>
    </form>`
}
