import React from 'react'

import _ from 'lodash'
import ProgressGraph from './graph'

export default ({progress}) => {
  if (_.isEmpty(progress)) {
    return <div>Please select an exercise</div>
  }

  return (
    <div>
      <p>Progress: </p>
      <ProgressGraph progress={progress} />
    </div>
  )
}
