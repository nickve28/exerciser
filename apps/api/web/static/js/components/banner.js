import React from 'react'
import {browserHistory} from 'react-router'

export default () => {
  return (
    <div>
      <span className="exerciser-logo clickable" onClick={() => browserHistory.push('/')} />
    </div>
  )
}