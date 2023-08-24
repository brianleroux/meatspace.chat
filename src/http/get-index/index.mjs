import arc from '@architect/functions'
// import channels from '@architect/shared/channels.mjs'

async function auth (req) {
  let account = req.session.account
  if (account) {
    // TODO get their channels
  }
}

async function index (req) {
  let body = login(req.query.invite)
  let html = `<!doctype html><html><body>${body}</body></html>`
  return { html }
}

export let handler = arc.http(auth, index)

// helper for rendering 'sign in with github'
function login (invite) {
  let base = `https://github.com/login/oauth/authorize`
  let client_id = process.env.GITHUB_CLIENT_ID
  let redirect_uri = process.env.GITHUB_REDIRECT
  let href = `${base}?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=user`
  if (invite)
    href += `&state=${invite}`
  return `<a href=${href}>Sign in with Github</a>`
}
