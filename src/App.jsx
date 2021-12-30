import React, { Component } from 'react'
import AdsVideo from './AdsVideo';
import path from './assets/2.mp4'

export default class App extends Component {

  preload = () => {
    this.video.sendXHR()
  }

  paused = () => {
    this.video.togglePaused()
  }

  muted = () => {
    this.video.setMuted()
  }

  // 视频播放结束回调函数
  onEnded = () => {
    alert('视频结束了')
  }

  // 跳到视频结尾
  jumpToEnd = () => {
    this.video.jumpToEnd()
  }

  componentDidMount() {
    console.log(this.video);
  }

  render() {
    const videoProps = {
      src: path,
      autoPlay: true,
      fluid: true,
      onEnded: this.onEnded
    }
    return (
      <div>
        <AdsVideo ref={video => this.video = video} {...videoProps} />
        <div>
          <button onClick={this.preload}>开始下载视频</button>
          <button onClick={this.paused}>开始/暂停</button>
          <button onClick={this.muted}>切换静音</button>
          <button onClick={this.jumpToEnd}>跳到结尾</button>
        </div>
      </div>
    )
  }
}
