const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:6020/path')

ws.on('open', function open() {
  ws.send('👋')
  ws.send('❤️ weather/berlin')
  ws.send('🎉 weather/berlin sunny')
  ws.send('💔 weather/berlin')
});

ws.on('message', function incoming(data) {
  console.log(data)
})

