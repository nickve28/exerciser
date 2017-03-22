import React from 'react'

import MediaQuery from 'react-responsive'
import {FloatingActionButton}from 'material-ui'
import ContentAdd from 'material-ui/svg-icons/content/add'

const SMALL_DEVICE_QUERY = '(max-device-width: 1024px)'
const LARGE_DEVICE_QUERY = '(min-device-width: 1024px)'

export default ({onClick}) => {
  return (
    <div>
      <MediaQuery query={LARGE_DEVICE_QUERY}>
        <a
          className="add-exercise"
          href="javascript:void(0);"
          style={{marginBottom: '5px'}}
          onClick={onClick}
        >+ Add Exercise</a><br />
      </MediaQuery>

      <MediaQuery query={SMALL_DEVICE_QUERY}>
        <FloatingActionButton onClick={onClick} className="add-exercise-btn">
          <ContentAdd />
        </FloatingActionButton>
      </MediaQuery>
    </div>
  )
}