/*
  Botpress module template. This is your module's entry point.
  Please have a look at the docs for more information about config, init and ready.
  https://botpress.io/docs
*/

import Userlike from './userlike'

let userlike = null;

module.exports = {

  config: {
    username: { type: 'string', default: '', env: 'USERLIKE_USERNAME' },
    password: { type: 'string', default: '', env: 'USERLIKE_PASSWORD' },
    hostname: { type: 'string', default: 'www.userlike.com', env: 'USERLIKE_HOST' }
   },

  init: async function(bp, configurator) {
    // This is called before ready.
    // At this point your module is just being initialized, it is not loaded yet.
  },

  ready: async function(bp, configurator) {
    // Your module's been loaded by Botpress.
    // Serve your APIs here, execute logic, etc.

    const config = await configurator.loadAll()
    
     userlike = new Userlike(bp, config);
     userlike.connect(bp);
  }
}
