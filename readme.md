# meatspace.chat

- [x] can sign in with github (and out)
- [x] signing in creates a new private channel (channels timeout)
- [x] invite friends to channel by sending them a private invite link
- [x] can chat in a channel, of course (240 chars; emoji ok; no html)
- [x] port to enhance.dev
- [x] reuse template between front and backend
- [ ] fix lint
- [ ] make the posting form a special custom element with client takeover
- [ ] can post an animated gif into the chat

# future ideas

- moderation features: kick and ban
- ability to destroy a channel before 24hrs
- ability to share audio, img, and video elements

# feedback

- @enhance/shared should be a thing
- @enhance/data should not return table
- @enhance/data paginated results should buffer or maybe have buffer built-in
- @enhance/data should use table as hashkey
- @enhance/data docs/helpers/examples for many-to-many, etc
- helpers for key, created, updated (soft delete?)
- dynamodb helper libs for single table design (how can we hide the join stuff)
- enhance needs publish/subscribe/send
- remove aws-sdk support from enhance/data
