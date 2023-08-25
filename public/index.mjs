// get the web socket url from the backend
let url = window.WS_URL

// all the DOM nodes this script will mutate
let main = document.getElementsByTagName('main')[0]
let msg = document.getElementById('message')
let form = document.getElementById('postform')

form.onsubmit = function onsubmit (e) {
  e.preventDefault()
  const data = new URLSearchParams(new FormData(form))
  fetch(window.location.href, {
    method: 'post',
    headers: {
      'x-fetching': '1'
    },
    body: data
  }).then(res => {
    res.json().then(console.log)
    msg.value = ''
  }).catch(err => {
    console.log(err)
  })
}

// setup the web socket
let ws = new WebSocket(url)
ws.onopen = open
ws.onclose = close
ws.onmessage = message
ws.onerror = console.log

// connect to the web socket
function open () {
  let ts = new Date(Date.now()).toISOString()
  main.innerHTML += `<p><b><code>${ts} - opened</code></b></p>`
}

// report a closed web socket connection
function close () {
  main.innerHTML += 'Closed <a href=/>reload</a>'
}

// write a message into main
function message (e) {
  let m = JSON.parse(e.data)
  console.log(m)
  main.innerHTML += `<article>
    <h3>${m.account.name || m.account.login || 'anon'}</h3>
    <img src="${m.account.avatar}" width=40>
    <p>${m.message}</p><a>${new Date(m.created).toISOString()}</a>
    <details>
      <summary>Post debug</summary>
      <pre>${JSON.stringify(m, null, 2)}</pre>
    </details>
  </article>`
}
