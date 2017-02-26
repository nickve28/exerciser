import React from 'react'
import {DatePicker} from 'material-ui'
import MediaQuery from 'react-responsive'

export default ({onChange, formatDate, defaultDate, name}) => {
  return (
    <MediaQuery minWidth={1024}>
      {isMatch => {
        const mode = isMatch ? 'landscape' : 'portrait'
        const container = isMatch ? 'inline' : 'dialog'
        return <DatePicker
          name={name}
          formatDate={formatDate}
          onChange={onChange}
          container={container}
          mode={mode}
          defaultDate={defaultDate}
        />
      }}
    </MediaQuery>
  )
}
