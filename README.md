# deepstream.io-emoticon-endpoint
An example endpoint using a protocol based on emoticons

This repo is used a playful experimental ground as an example for what a different connection endpoint can do.

Currently is can only be used against deepstream 2.3.5 (not yet released at this time) and only supports events pub/sub for simplicity sake.

The concept is to be able to write a very basic protocol purely using emotions for actions.

The client code to subscribe to an login, subscribe and unsubscribe is:

```
const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:6020/path')

ws.on('open', function open() {
  // Authenticate
  ws.send('👋')
  // Subscribe with :heart:
  ws.send('❤️ weather/berlin')
  // Emit with :tada:
  ws.send('🎉 weather/berlin sunny')
  // Unsubscribe with :broken_heart:
  ws.send('💔 weather/berlin')
});

ws.on('message', function incoming(data) {
  console.log(data)
})
```

Couple of technical details:
- Still uses websockets under the hood, but that can be easily changed to UDP, TCP, Engine.io.. or anything else
- I use the js-emoji library which is nice because it translates colon and native emoticons to the same base. However it doesn't seem to support basic text characters like :P

