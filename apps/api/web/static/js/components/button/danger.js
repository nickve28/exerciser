import React from 'react'

export default props =>
  <button {...props} className="button button-danger">{props.children}</button>