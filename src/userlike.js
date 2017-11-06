import Client from 'node-xmpp-client'
import incoming from './incoming'
import Promise from 'bluebird'

class Userlike {
  constructor(bp, config) {

    if (!bp || !config) {
      throw new Error('You need to specify botpress and config')
    }

    this.client = null
    this.config = config
    this.connected = false
    this.Client = Client;
  }
  
  connect(bp) {
    
    const online = () => {
      if(!this.connected) {
        this.client.send(new (Client.Stanza)('presence', {}).c('show').t('chat').up().c('status').t('I\'m a bot'));
        this.connected = true;
        incoming(bp, this);
      }
    }
    
    this.client = new Client({
      jid: this.config.username,
      password: this.config.password,
      host: this.config.hostname
    }).on('online', online);
    
  }
  
  sendText(jid, text, options) {
    const client = this.client, 
      message = new (Client.Stanza)('message', {
      to: jid,
      type: "chat",
      level: "chat"
    }).c('body').t(text);
    
    return new Promise((r, rj) => {
      const send = () => {
        client.send(message);
        client.send(new (Client.Stanza)('message', { to: jid, type: "chat"}).c('paused'));
        r();
      };
      client.send(new (Client.Stanza)('message', { to: jid, type: "chat"}).c('active'));
      if(options.typing){
        client.send(new (Client.Stanza)('message', { to: jid, type: "chat"}).c('composing'));
      }
      setTimeout(send, options.typing || 0);
    });
    
  }
}
module.exports = Userlike;