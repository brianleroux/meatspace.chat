export default function layout ({ html, state }) {
  return html`
    <header>layout header</header>
    <main><slot></slot></main>
    <app-debug></app-debug>
  `
}

