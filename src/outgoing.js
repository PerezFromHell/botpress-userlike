const handlePromise = (event, next, promise) => {
  return promise.then(res => {
    next()
    event._resolve && event._resolve()
    return res
  })
  .catch(err => {
    next(err)
    event._reject && event._reject(err)
    throw err
  })
}

const handleText = (event, next, userlike) => {
  if (event.platform !== 'userlike' || event.type !== 'text') {
    return next()
  }
  const options = event.raw.options;
  const user = event.user;
  const text = event.text;
  return handlePromise(event, next, userlike.sendText(user.jid, text, options));
  
}
module.exports = {
  'text': handleText
}