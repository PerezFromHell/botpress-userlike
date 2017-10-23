
const isFromBot = (stanza)=>{
  
}

const preprocessStanza = (stanza)=> {
  
}



module.exports = (bp, userlike) => {

  userlike.client.on('stanza', function(stanza){
    if(isFromBot(stanza)) return;

    if(stanza.is('message')){
      bp.middlewares.sendIncoming({
        type: stanza.type,
        platform: 'userlike',
        // text: stanza.getChildText('body'),
        text: 'text',
        raw: stanza
        // user: user 
      })
    }

    // if (stanza.is('presence')){
    //   console.log('🗸 stanza is presence')
    // }
    // if (stanza.is('message') && stanza.getChildText('body') !== null){
    //   console.log('⮞ stanza text: ' + stanza.getChildText('body'));
    // }

    // console.log('⮈', stanza.toString());
  
    console.log(' TO   : ' + stanza.attrs.to);
    console.log(' FROM : ' + stanza.attrs.from);
    if (stanza.is('message') && stanza.getChildText('body') !== null){
      console.log('⮞ stanza text: ' + stanza.getChildText('body'));
    }
  });
}