export default function layout ({ html, state }) {
  return html`
    <header>
      <h1>${state.attrs.title || 'meatspace.chat'}</h1>
      <slot name=header></slot>
    </header>
    <main><slot></slot></main>
    <footer>
      <slot name=footer></slot>
      <app-debug></app-debug>
    </footer>
  `
}

