export async function handler (event) {
  console.log('ws default event', event)
  return { statusCode: 200 }
}
