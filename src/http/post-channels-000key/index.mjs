export async function handler (req) {
  let key = req.params.key
  // TODO post message to channel
  return {
    location: `/channels/${key}`
  }
}
