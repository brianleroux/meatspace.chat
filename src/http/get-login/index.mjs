import arc from '@architect/functions'
import channels from '@architect/shared/channels.mjs'
import github from './github.mjs'

export let handler = arc.http(login)

async function login (req) {
  try {
    // try to login
    let account = await github(req)
    if (account) {
      let key = await channels.create(account)
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
