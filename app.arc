@app
arc-example-wss

@dns
domain b391n.com
zone Z00778763548G9B2UQDPO
#domain meatspace.chat
#zone Z02440513BVKWOLBE80NL

@plugins
cdn
  src src/plugins/cdn.mjs

@ws
@http
get /
post /
post /reset

@tables
data
  scopeID *
  dataID **
  ttl TTL

@aws
profile begin #brian
region us-east-1
architecture arm64
