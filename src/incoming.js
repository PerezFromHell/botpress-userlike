module.exports = (bp, userlike) => {
  
  userlike.client.on('stanza', function(stanza){
    console.log('⮈', stanza.toString())
  });
}