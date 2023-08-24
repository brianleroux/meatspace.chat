@app
arc-example-wss

@dns
domain meatspace.chat
zone Z02440513BVKWOLBE80NL

@plugins
cdn
  src src/plugins/cdn.mjs

@ws
@http
get /
# auth
get /login
post /logout
# chat
get /channels/:key
get /invites/:key

@tables
data
  scopeID *
  dataID **
  ttl TTL

@aws
profile brian
region us-east-1
architecture arm64
