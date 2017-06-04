const EmojiConvertor = require('emoji-js')
const ec = new EmojiConvertor()
ec.init_env()
ec.replace_mode = 'unified'
ec.allow_native = true

const EC = {
  A: ec.replace_colons(':thumbsup:'),
  REQ: ec.replace_colons(':wave:'),
  S: ec.replace_colons(':heart:'),
  US: ec.replace_colons(':broken_heart:'),
  EVT: ec.replace_colons(':tada:')
}

const ECR = {}
for (const key in EC) {
  ECR[EC[key]] = key
}

module.exports = {
  C: EC,
  toDeepstream (message) {
  	const parts = message.split(' ')
  	if (parts.length > 3) {
  	  return new Error('Maximum of two parts')
  	}
  	parts[0] = ec.replace_unified(parts[0])
  	parts[0] = ec.replace_colons(parts[0])
  	if (ECR[parts[0]] === undefined) {
  	  return new Error('Unknown action')
  	}

  	const data = []
  	if (parts[1] !== undefined) data.push(parts[1])
  	if (parts[2] !== undefined) data.push(parts[2])

  	return [{
  	  topic: 'E',
  	  action: ECR[parts[0]],
  	  data
  	}]
  },
  fromDeepstream (topic, action, data) {
    if (action.length > 3) {
      return `${action} ${data}`
    }
  	return `${EC[action]}  ${ec.replace_colons(data[1])}`
  }
}
