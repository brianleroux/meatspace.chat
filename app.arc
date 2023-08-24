@app
arc-example-wss

# used by src/plugins/cdn.mjs
@dns
domain meatspace.chat
zone Z02440513BVKWOLBE80NL

# sets up dns
@plugins
cdn
  src src/plugins/cdn.mjs

# enable src/ws/* handlers
@ws

# enable src/http/* handlers
@http

# home
get /

# auth
get /login
post /logout

# chat
get /channels/:key
post /channels/:key

# table for begin/data
@tables
data
  scopeID *
  dataID **
  ttl TTL

# creds
@aws
profile brian
region us-east-1
architecture arm64
