import Promise from 'bluebird'

const create = obj => {
  let resolve = null
  let reject = null
  const promise = new Promise((r, rj) => {
    resolve = r
    reject = rj
  })

  const messageId = new Date().toISOString() + Math.random()
  
  const newEvent = Object.assign({
    _promise: promise,
    _resolve: resolve,
    _reject: reject,
    __id: messageId
  }, obj)

  return newEvent
}

const validateText = (text) => {
  if (typeof(text) !== 'string') {
    throw new Error('Text must be a string.')
  }
}

const createText = (user, text, options = {}) => {
  validateText(text);
  
  return create({
    platform: 'userlike',
    type: 'text',
    text: text,
    user: user,
    raw: { options }
  })
}

module.exports = {
  createText
}