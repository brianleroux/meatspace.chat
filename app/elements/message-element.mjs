export default function message ({ html, state }) {
  return html`<article>
    <h3>${state.attrs.name}</h3>
    <img src="${state.attrs.avatar}" width=40>
    <p>${state.attrs.message}</p>
    <a>${state.attrs.created}</a>
  </article>`
}
