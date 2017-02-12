import React from 'react'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

import _ from 'lodash'

export default ({progress}) => {
  const data = _.reverse(progress.progress)

  return (
    <LineChart width={600} height={300} data={data}>
      <Line type="monotone" dataKey="weight" stroke="#8884d8" />
      <Line type="monotone" dataKey="reps" stroke="#000000" />
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
    </LineChart>
  )

}
