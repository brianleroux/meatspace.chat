import channels from '../../shared/channels.mjs'
import link from '../../shared/github.mjs'

/** display invite page if ?invite exists */
async function invite (req) {
  if (req.query.invite) {
    let channel = await channels.read({ key: req.query.invite })
    if (channel) {
      let invite = link(req.query.invite)
      return {
        json: {  invite }
      }
    }
  }
}

/** if no invite code, and authenticated, show list of channels */
async function auth (req) {
  let account = req.session.account
  if (account) {
    let list = await channels.list(account)
    return {
      json: { account, channels: list }
    }
  }
}

/** if neither invite code or authenticated; invite them to create a channel by signing in */
async function index () {
  return {
    json: { github: link() }
  }
}

/** registers middleware to GET / */
export let get = [ invite, auth, index ]
