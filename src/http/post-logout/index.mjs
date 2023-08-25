import arc from '@architect/functions'

export let handler = arc.http(async function logout () {
  return {
    session: { account: false },
    location: '/'
  }
})
