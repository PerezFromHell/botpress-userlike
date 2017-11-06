import util from 'util'
import _ from 'lodash'

import actions from './actions';

function processOutgoing({ event, blocName, instruction }) {
  const ins = Object.assign({}, instruction) // Create a shallow copy of the instruction
  const optionsList = ['typing'];
  
  const options = _.pick(instruction, optionsList)
 
  for (let prop of optionsList) {
    delete ins[prop]
  }
  
  if (!_.isNil(instruction.text)) {
    return actions.createText(_.get(event, 'user'), instruction.text, options)
  }
  
  const strRep = util.inspect(instruction, false, 1);
  throw new Error(`Unrecognized instruction on Slack in bloc '${blocName}': ${strRep}`)
}

module.exports = bp => {
  const [umm, registerConnector] = _.at(bp, ['umm', 'umm.registerConnector'])

  umm && registerConnector && registerConnector({
    platform: 'userlike',
    processOutgoing: args => processOutgoing(Object.assign({}, args, { bp })),
    templates: []
  })
}