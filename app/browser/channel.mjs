import enhance from '@enhance/element'
import msg from '../elements/message-element.mjs'
import form from '../elements/form-post-message.mjs'

/** setup the message element client render */
enhance('message-element', { render: msg })

/** progressive enhance form post */
enhance('form-post-message', {
  render: form,
  init() {
    let form = document.getElementById('postform')
    let msg = document.getElementById('message')
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
        msg.value = ''
        res.json().then(console.log)
      })
    }
  }
})

/** setup the socket */
    // get the web socket url from the backend
    let url = window.WS_URL

    // all the DOM nodes this script will mutate
    let main = document.getElementsByTagName('main')[0]
    
    // setup the web socket
    let ws = new WebSocket(url)

    // connect to the web socket
    ws.onopen = function open () {
      let ts = new Date(Date.now()).toISOString()
      main.innerHTML += `<p><b><code>${ts} - opened</code></b></p>`
    }

    // report a closed web socket connection
    ws.onclose = function close () {
      main.innerHTML += 'Closed <a href=/>reload</a>'
    }

    // write a message into main
    ws.onmessage = function message (e) {
      let channel = window.location.pathname.replace('/channels/', '')
      let m = JSON.parse(e.data)
      if (m.channel === channel) {
        main.innerHTML += `
          <message-element 
            key=${m.key}
            name=${m.account.name || m.account.login || 'anon'}
            avatar=${m.account.avatar}
            message="${m.message}"
            created=${new Date(m.created).toISOString()}
          ></message-element>`
      }
    }

    ws.onerror = console.log
