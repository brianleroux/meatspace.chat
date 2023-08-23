import arc from '@architect/functions'

export let handler = arc.http.async(fn)

async function fn (req) {
  let count = req.session.count || 0
  count += 1
  return {
    session: { count },
    location: '/'
  }
}
