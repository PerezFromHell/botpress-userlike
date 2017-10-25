
const handleText = (event, next, userlike) => {
  if (event.platform !== 'userlike' || event.type !== 'text') {
    return next()
  }

  const user = event.user;
  const text = event.text;
  const incomingStanza = event.raw;
  
  let stanza = new (Client.Stanza)('message', {
    to: user.jid,
    type: "chat",
    level: "chat"
  }).c('body').t('text');
  userlike.client.send(stanza);
  event._resolve && event._resolve();
  
}
module.exports = {
  'text': handleText
}