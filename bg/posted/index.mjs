import arc from '@architect/functions'
import channels from '@architect/shared/channels.mjs'

export let handler = arc.events.subscribe(channels.posted)
