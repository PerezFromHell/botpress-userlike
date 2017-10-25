/*
  Botpress module template. This is your module's entry point.
  Please have a look at the docs for more information about config, init and ready.
  https://botpress.io/docs
*/

import Userlike from './userlike'
import outgoing from './outgoing'
let userlike = null;

const outgoingMiddleware = (event, next) => {
  if (event.platform !== 'userlike') {
    return next()
  }

  if (!outgoing[event.type]) {
    return next('Unsupported event type: ' + event.type)
  }

  outgoing[event.type](event, next, userlike)
}

module.exports = {

  config: {
    username: { type: 'string', default: '', env: 'USERLIKE_USERNAME' },
    password: { type: 'string', default: '', env: 'USERLIKE_PASSWORD' },
    hostname: { type: 'string', default: 'www.userlike.com', env: 'USERLIKE_HOST' }
   },

  init: async function(bp, configurator) {
    bp.middlewares.register({
     name: 'userlike.sendMessages',
     type: 'outgoing',
     order: 100,
     handler: outgoingMiddleware,
     module: 'botpress-userlike',
     description: 'Sends out messages that targets platform = userlike.' +
     ' This middleware should be placed at the end as it swallows events once sent.'
   })
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
