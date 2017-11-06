const isFromBot = (bp, userlike, stanza)=>{
  const from = stanza.attrs.from;
  if( from == null) {
    return false;
  }
  return from.indexOf(userlike.config.username) === 0; 
}

let users = {};

const process = {
  presence: function(bp, userlike, stanza){
    if(isFromBot(bp, userlike, stanza)) return;
    const show = stanza.getChildText('show');
    if(show !== 'chat' ) {
      return; 
    }
    const jid = stanza.attrs.from,
      id = jid.split('/')[0];
    users[id] = users[id] || { id, jid };
    //console.warn('⮞ presence', id,  stanza.toString());
    
  },
  
  iq: function(bp, userlike, stanza) {
    const type = stanza.type;
    
    if(type !== 'set') {
      return;
    }
    
    const query = stanza.getChild('query'),
      item  = query.getChild('item'),
      group = item.getChildText('group'),
      id    = item.attrs.jid,
      name  = item.attrs.name,
      user    = users[id];
    
    if(!user || user.online){
      return;
    }
    
    Object.assign(user, { online: true, name: name });
    
    bp.middlewares.sendIncoming({
     type: 'online',
     platform: 'userlike',
     text: '',
     raw: stanza,
     user: user
    });
    //console.warn('⮞ online', user.name);
  },
  
  message: function(bp, userlike, stanza) {
    if(stanza.attrs.type != 'chat' || stanza.attrs.level != "chat" || isFromBot(bp, userlike, stanza)){
      return;
    } 
    let body = stanza.getChildText('body'), 
      jid = stanza.attrs.from,
      id = jid.split('/')[0],
      user = users[id];
      
    if(!body || !user ) return
    user.online = true;
    bp.middlewares.sendIncoming({
      type: 'message',
      platform: 'userlike',
      text: body,
      raw: stanza,
      user: user
    });
    
    //console.debug('⮞ message', text, 'from', user.name, user.jid);
  }
}

module.exports = (bp, userlike) => {

  userlike.client.on('stanza', function(stanza){
    //console.log('⮈', stanza.toString());
    
    const action = process[stanza.getName()];
    if(!action){
      return 
    }
    
    action(bp, userlike, stanza);
  
  });
}