export default function layout ({ html, state }) {
  return html`
    <header>${state.attrs.title || 'meatspace.chat'}</header>
    <main><slot></slot></main>
    <footer>
      <slot name=footer></slot>
      <app-debug></app-debug>
    </footer>
  `
}

