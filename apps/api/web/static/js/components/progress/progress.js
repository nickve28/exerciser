import React from 'react'

import _ from 'lodash'
import ProgressGraph from './graph'
import EnduranceProgressGraph from './endurance_graph'

export default ({progress, exerciseType}) => {
  if (_.isEmpty(progress)) {
    return <div>Please select an exercise</div>
  }

  if (exerciseType === 'strength') {
    return (
      <div>
        <p>Progress: </p>
        <ProgressGraph progress={progress} />
      </div>
    )
  }
  return (
    <div>
      <p>Progress: </p>
      <EnduranceProgressGraph progress={progress} />
    </div>
  )
}
