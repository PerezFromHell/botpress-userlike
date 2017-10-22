import React from 'react'

import style from './style.scss'

export default class TemplateModule extends React.Component {
  constructor(props){
    super(props)
    
    this.state = {
      loading: true,
      username: '',
      password: '',
      hostname: 'www.userlike.com'
    }
  }

  render() {
    return <h4>This module is empty...</h4>
  }
}
