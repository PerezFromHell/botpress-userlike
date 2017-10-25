let users = {
  
};

const isFromBot = (bp, userlike, stanza)=>{
  let from = stanza.attrs.from;
  let fromBot =  from.indexOf(userlike.config.username) === 0;
  // console.log('fromBot', fromBot);
  return fromBot;
}

const process = {
  presence: function(bp, userlike,stanza){
    if(isFromBot(bp, userlike, stanza)) return;
    
    let jid = stanza.attrs.from,
      privateJid = jid.split('/')[0],
      user = users[privateJid] || (users[privateJid] = {
        jid : jid,
        privateJid : privateJid
      });
  },
  iq: function(bp, userlike, stanza) {
    let type = stanza.type;
    
    if(stanza.type === 'set') {
      let query = stanza.getChild('query'),
        item = query.getChild('item'),
        group = item.getChildText('group'),
        privateJid = item.attrs.jid,
        name = item.attrs.name,
        user = users[privateJid];
        
        if(user && !user.online){
           users[privateJid] = Object.assign(user, {name,group, online: true });
           bp.middlewares.sendIncoming({
             type: 'presence',
             platform: 'userlike',
             text: 'presence',
             raw: stanza,
             user: user
           });
           console.log('⮞ user online ', user);
        }
    }
    
    
  },
  
  message: function(bp, userlike, stanza) {
    if(stanza.attrs.type != 'chat' || stanza.attrs.level != "chat" || isFromBot(bp, userlike, stanza)){
      return;
    } 
    let body = stanza.getChildText('body'), 
      jid = stanza.attrs.from,
      privateJid = jid.split('/')[0],
      user = users[privateJid];
      
    if(!user||!body) return
    bp.middlewares.sendIncoming({
      type: 'message',
      platform: 'userlike',
      text: 'Hi',
      raw: stanza,
      user: user
    });
    console.log('⮞ message online ', stanza.toString(), 'from', user.name);
  }
}

module.exports = (bp, userlike) => {

  userlike.client.on('stanza', function(stanza){
    // console.log('⮈', stanza.toString());
    
    let action = process[stanza.getName()];
    if(!action){
      return 
    }
    
    action(bp, userlike, stanza);
    
    
    // if (stanza.is('presence')){
    //   console.log('🗸 ' + stanza.getChildText('status'));
    // }

    // if (stanza.is('message') && stanza.getChildText('body') !== null){
    //   console.log(' TO   : ' + stanza.attrs.to + '\n' +
    //               ' FROM : ' + stanza.attrs.from  + '\n' +
    //               '⮞ stanza text: ' + stanza.getChildText('body'));
    // }
    
    
    // if (stanza.is('message')){

    //   console.log('⮞ stanza is message');

    //   if (isFromBot(stanza.is('message'))) {
    //     console.log('⮞ mesaj de la robot');
    //   }

    //   if (stanza.is('message') && stanza.getChildText('body') !== null){
    //     console.log('⮞ ' + stanza.getChildText('body'));
    //   }
    // };
    
    // All stanza info
    console.log('⮈', stanza.toString());
  });
}