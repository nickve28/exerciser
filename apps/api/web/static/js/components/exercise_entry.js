import React from 'react'
import _ from 'lodash'

import {TableRow, TableRowColumn} from 'material-ui/Table'
import FlatButton from 'material-ui/FlatButton'

export default ({exercise, onDelete}) => {
  return (
    <TableRow key={exercise.id}>
      <TableRowColumn>{exercise.name}</TableRowColumn>
      <TableRowColumn>{exercise.categories.join(',')}</TableRowColumn>
      <TableRowColumn>{_.truncate(exercise.description, 30)}</TableRowColumn>
      <TableRowColumn><FlatButton secondary={true} onClick={onDelete} label="x" /></TableRowColumn>
    </TableRow>
  )
}