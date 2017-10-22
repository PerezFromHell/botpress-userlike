import Client from 'node-xmpp-client'
import incoming from './incoming'

class Userlike {
  constructor(bp, config) {

    if (!bp || !config) {
      throw new Error('You need to specify botpress and config')
    }

    this.client = null
    this.config = config
    this.connected = false
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
}

module.exports = Userlike;