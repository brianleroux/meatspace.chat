import link from '@architect/shared/github-signin-link.mjs'

export default function notfound (key) {
  let href = link({ text: 'Sign in with GitHub and start a new channel' })
  return `could not find /channels/${key}; ${href}`
}
