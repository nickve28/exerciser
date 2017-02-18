import React from 'react'
import moment from 'moment'

import {DatePicker} from 'material-ui'

const formatDate = date => {
  return moment(date).format('YYYY-MM-DD')
}

export default ({startDate, endDate, onSelect}) => {

  if (!startDate || !endDate) {
    return <div />
  }

  return (
    <div>
      <label>Start date</label>
      <DatePicker
        name="startDate"
        formatDate={formatDate}
        onChange={(e, val) =>  {
          //e = empty event, 2nd arg = date
          const date = formatDate(val)
          onSelect({from: date})
        }}
        container="inline"
        mode="landscape"
        defaultDate={moment(startDate).toDate() || moment().toDate()}
      />
      <label>End date</label>
      <DatePicker
        name="endDate"
        formatDate={formatDate}
        onChange={(e, val) =>  {
          //e = empty event, 2nd arg = date
          const date = formatDate(val)
          onSelect({until: date})
        }}
        container="inline"
        mode="landscape"
        defaultDate={moment(endDate).toDate() || moment().toDate()}
      />
    </div>
  )
}