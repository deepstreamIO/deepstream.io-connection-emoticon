'use strict';

const WebSocketServer = require('uws').Server
const events = require('events')
const EmoticonSocketWrapper = require('./emoticon-socket-wrapper')
const emoticonMessageBuilder = require('./emoticon-messages')

module.exports = class EmoticonConnectionEndpoint extends events.EventEmitter {

  constructor (options) {
    super()
    this._options = options
    this.isReady = false
    this.description = `emoticon connection endpoint on port: ${this._options.port}`
    this.initialised = false

    this._sockets = new Map()
  }

  setDeepstream (deepstream) {
    this._dsOptions = deepstream._options
    this.C = deepstream.constants
  }

  /**
   * To be overriden by deepstream.io
   */
  onMessages () {}

  init () {
    this.wss = new WebSocketServer({ port: this._options.port }, () => {
      this.isReady = true
      this.emit('ready')
    })

    this.wss.on('connection', ws => {
      const socketWrapper = new EmoticonSocketWrapper(ws)
      ws.on('message', message => {
        const parsedMessages = emoticonMessageBuilder.toDeepstream(message)
        if (socketWrapper.isAuthenticated) {
          this.onMessages(
            socketWrapper,
            parsedMessages
          )
        } else if (
          parsedMessages.length === 1 &&
          parsedMessages[0].action === this.C.ACTIONS.REQUEST
        ) {
          socketWrapper.user = parsedMessages[0].data[0] || 'OPEN'
          socketWrapper.isAuthenticated = true
          socketWrapper.sendMessage(
            this.C.TOPIC.AUTH,
            this.C.ACTIONS.ACK,
            ['', ':key:']
          )
        } else {
          socketWrapper.sendError(
            this.C.TOPIC.AUTH,
            this.C.EVENT.INVALID_AUTH_DATA,
            'invalid authentication.. please ' + emoticonMessageBuilder.C.REQ
          )
        }
      })
    })
  }

  close () {
    this.wss.close()
    setTimeout(this.emit.bind(this, 'close'), 500)
  }
}
