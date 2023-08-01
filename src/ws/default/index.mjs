// learn more about WebSocket functions here: https://arc.codes/ws
export async function handler (req) {
  console.log('default message handler', JSON.stringify(req, null, 2))
  return { statusCode: 200 }
}
