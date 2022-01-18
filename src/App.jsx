import React from 'react'
import { Link } from 'react-router-dom';

export default function App() {
  return (
    <div>
      <Link to='/video'>跳转视频</Link>

      <hr style={{ margin: "10px 0" }} />

      <Link to='/ads'>跳转广告</Link>
    </div>
  )
}
