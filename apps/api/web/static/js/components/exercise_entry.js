import React from 'react'
import _ from 'lodash'

import {TableRow, TableRowColumn} from 'material-ui/Table';

export default ({exercise, onDelete}) => {
  return (
    <TableRow key={exercise.id}>
      <TableRowColumn>{exercise.name}</TableRowColumn>
      <TableRowColumn>{exercise.categories.join(',')}</TableRowColumn>
      <TableRowColumn>{_.truncate(exercise.description, 30)}</TableRowColumn>
      <TableRowColumn><button className="btn btn-danger btn-xs" onClick={onDelete} >x</button></TableRowColumn>
    </TableRow>
  )
}