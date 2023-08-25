@app
arc-example-wss

# enable src/ws/* handlers
@ws
connect
  src bg/connect

default
  src bg/default

disconnect
  src bg/disconnect 

# setup an async bg event for broadcasting to channels
@events
message-posted
  src bg/posted

# used by src/plugins/cdn.mjs
@dns
domain meatspace.chat
zone Z02440513BVKWOLBE80NL

@plugins
enhance/arc-plugin-enhance
enhance/styles-cribsheet
cdn
  src plugins/cdn.mjs

# creds
@aws
profile brian
region us-east-1
architecture arm64
