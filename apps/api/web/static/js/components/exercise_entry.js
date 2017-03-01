import React from 'react'

//import FlatButton from 'material-ui/FlatButton'

export default ({exercise, onDelete}) => {
  return (
    <li className="list-group-item">
      <div className="pull-right">
        <button className="btn btn-xs btn-danger" style={{marginLeft: '5px'}} onClick={onDelete}>x</button>
      </div>
      {exercise.name}
    </li>
  )
}