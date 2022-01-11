import React from 'react'
import './index.css'

export default function Progress(props) {

  const { bgColor, color, progress } = props

  return (
    <div className="progressBar" style={{ backgroundColor: bgColor }}>
      <div className="progress" style={{ width: progress, backgroundColor: color }}></div>
    </div>
  )
}
