import channels from '../../shared/channels.mjs'
import tiny from 'tiny-json-http'

/** responds to GET /login for oauth flow */
export async function get (req) {
  try {
    // try to login
    let account = await github(req)
    if (account) {
      // find or create a channel for them
      let key
      let invite = req.query.state
      if (invite) {
        let channel = await channels.read({ key: invite })
        if (channel) {
          await channels.join({ channel, account })
          key = channel.key
        }
      }
      if (!key) {
        key = await channels.create(account)
      }
      return {
        session: { account },
        location: `/channels/${key}`
      }
    }
    else {
      throw Error('login_failed')
    }
  }
  catch (err) {
    console.log(err)
    return {
      location: '/?failed=' + err.message
    }
  }
}

/** helper for authorizing github */
async function github (req) {

  // trade the code for an access token
  let result = await tiny.post({
    url: 'https://github.com/login/oauth/access_token',
    headers: {
      Accept: 'application/json',
    },
    data: {
      code: req.query.code,
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      redirect_uri: process.env.GITHUB_REDIRECT,
    }
  })

  let token = result.body.access_token

  // use the access token to get the user account
  let user = await tiny.get({
    url: `https://api.github.com/user`,
    headers: {
      Accept: 'application/json',
      Authorization: `token ${token}`
    }
  })

  // create a clean acccount obj
  return {
    // token,
    name: user.body.name,
    login: user.body.login,
    id: user.body.id,
    url: user.body.url,
    avatar: user.body.avatar_url
  }
}
