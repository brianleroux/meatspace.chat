import arc from '@architect/functions'
import link from '@architect/shared/github-signin-link.mjs'
import channels from '@architect/shared/channels.mjs'

/** if there is an invite code always show invite page */
async function invite (req) {
  let invite = req.query.invite
  if (invite) {
    let channel = await channels.read({ key: invite })
    if (channel) {
      let text = `Join ${channel.name}`
      let body = link({ invite, text })
      let html = `<!doctype html><html><body>${body}</body></html>`
      return { html }
    }
  }
}

/** if no invite code, and authenticated, show list of channels */
async function auth (req) {
  let account = req.session.account
  if (account) {
    let list = await channels.list(account)
    console.log(list)
    if (list.length) {
      let li = i => `<li><a href=/channels/${i.key}>${i.channel.name}</a></li>`
      return {
        html: `
          <h1>${account.login} channels</h1>
          <ul>${list.map(li).join('')}</ul>
        `
      }
    }
  }
}

/** if neither invite code or authenticated; invite them to create a channel by signing in */
async function index () {
  let body = link({})
  let html = `<!doctype html><html><body>${body}</body></html>`
  return { html }
}

export let handler = arc.http(invite, auth, index)
