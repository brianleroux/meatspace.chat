// helper for rendering 'sign in with github'
export default function link (invite) {
  let base = `https://github.com/login/oauth/authorize`
  let client_id = process.env.GITHUB_CLIENT_ID
  let redirect_uri = process.env.GITHUB_REDIRECT
  let href = `${base}?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=user`
  if (invite)
    href += `&state=${invite}`
  return href
}
