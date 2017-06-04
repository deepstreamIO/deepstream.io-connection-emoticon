'use strict'

const EventEmitter = require('events').EventEmitter
const emoticonMessageBuilder = require('./emoticon-messages')

module.exports = class EmoticonSocketWrapper extends EventEmitter {

  constructor (socket) {
    super()
    this.socket = socket
    this.uuid = Math.random()
  }

  getMessage (topic, action, data) {
    return emoticonMessageBuilder.fromDeepstream(topic, action, data)
  }

  prepareMessage (message) {
    return message
  }

  sendPrepared (preparedMessage) {
    this.socket.send(preparedMessage)
  }

  finalizeMessage (preparedMessage) {
  } 

  sendNative (message, allowBuffering) {
    this.socket.send(message)
  }

  sendError (topic, type, msg, allowBuffering) {
    this.sendNative(
      emoticonMessageBuilder.fromDeepstream(topic, type, msg)
    )
  }

  sendMessage (topic, action, data, allowBuffering) {
    this.sendNative(
      emoticonMessageBuilder.fromDeepstream(topic, action, data)
    )
  }

  destroy () {
  }

  close () {
  }

  getHandshakeData () {
  }
}
