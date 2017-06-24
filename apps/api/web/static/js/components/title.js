import React from 'react'

export default ({ title, count, children }) =>
  <div className="title-box">
    <h3 style={{ display: 'inline' }}>{title} ({count})</h3>
    {children}
  </div>