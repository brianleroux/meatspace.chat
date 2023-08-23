import arc from '@architect/functions'

export let handler = arc.http.async(fn)

async function fn (req) {
  return {
    html: `<!doctype html>
<html>
<body>
<h1>Web sockets echo server demo</h1>
<main>Loading...</main>
<input id=message type=text placeholder="Enter message" autofocus>

<hr>

<form action="/" method="GET">
  <label for="foo">foo:</label>
	<input type=text name=foo value=bar placeholder=bar>
	<button>GET</button>
</form>

<hr> 

<div>
  <p>This counter increments with each page load.</p>
	<pre><code>count: ${req.session.count || 0}</code></pre>
  <form method=post action=/>
    <button>+1</button>
    <input type=submit formaction=/reset value=reset>
  </form>
</div>

<hr>

<pre><code>${JSON.stringify(req, null, 2)}</code></pre>
<script>
window.WS_URL = 'wss://b391n.com/_wss/'
</script>
<script type=module src="/_static/index.mjs"></script>
</body>
</html>`
  }
}
