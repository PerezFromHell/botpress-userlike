
const handleText = (event, next, userlike) => {
  if (event.platform !== 'userlike' || event.type !== 'text') {
    return next()
  }
  // console.log("handleText", event.text);

  const user = event.raw.user;
  const text = event.text;
  
  userlike.send(user.jid, text);
  event._resolve && event._resolve();
  
}
module.exports = {
  'text': handleText
}