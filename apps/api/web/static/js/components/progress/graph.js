import React from 'react'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'

import _ from 'lodash'

import Moment from 'moment'
import { extendMoment } from 'moment-range'

const moment = extendMoment(Moment)

const createEmptyObject = (date) => {
  return [{reps: null, sets: null, weight: null, date: date}] //shame we need to workaround like this..
}

export default ({progress}) => {
  const data = _.reverse(progress.progress)
  //workaround since dates are not properly supported in this library...
  const startDate = _.first(data).date
  const endDate = _.last(data).date
  const dateRange = Array.from(moment.range(startDate, endDate).by('day'))

  const groupedData = _.groupBy(data, 'date')
  const graphData = _.reduce(dateRange, (memo, date) => {
    const dateFormatted = moment(date).format('YYYY-MM-DD')
    let progressData = groupedData[dateFormatted] || createEmptyObject(dateFormatted)
    progressData = _.map(progressData, d => {
      return _.defaults({date: moment(d.date).format('DD-MM-YY')}, d)
    })

    memo = _.concat(memo, progressData)
    return memo
  }, [])
  const metric = progress.exerciseMetric

  return (
    <ResponsiveContainer width="95%" height={300}>
      <LineChart data={graphData}>
        <Line type="monotone" name={metric} dataKey="weight" stroke="#8884d8" connectNulls={true} />
        <Line type="monotone" dataKey="reps" stroke="#000000" connectNulls={true} />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
      </LineChart>
    </ResponsiveContainer>
  )

}
