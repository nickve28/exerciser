import React from 'react'

const getTitle = (title, count) => {
  if (count || count === 0) {
    return `${title} (${count})`
  }
  return title
}

export default ({ title, count, children }) =>
  <div className="title-box">
    <h3 style={{ display: 'inline' }}>{getTitle(title, count)}</h3>
    {children}
  </div>