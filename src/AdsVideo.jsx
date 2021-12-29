import React, { Component } from 'react';
import { number, string, bool, oneOf, func } from 'prop-types'
import {
  Player,
  ControlBar,
  BigPlayButton
} from 'video-react';
import { formatSeconds } from './utils/dateFormat'
import './AdsVideo.css'
import "../node_modules/video-react/dist/video-react.css"; // import css


export default class AdsVideo extends Component {

  state = {
    player: {},
    canPlayThrough: false
  }

  componentDidMount() {
    // Subscribe to the player state changes.
    this.player.subscribeToStateChange(this.setChange.bind(this))
    this.item.oncontextmenu = e => e.preventDefault()
  }

  componentDidUpdate(preProps, preState) {
    if (this.state.player.ended !== preState.player.ended) {
      if (this.state.player.ended === true) {
        this.props.onEnded()
      }
    }
    return true
  }

  // 观察视频的状态
  setChange() {
    const { player } = this.player.getState()
    this.setState({
      player
    })
  }

  togglePaused = () => {
    const { player: { paused } } = this.player.getState()
    paused ? this.player.play() : this.player.pause()
  }

  setMuted = () => {
    this.player.muted = !this.player.muted
  }

  // 跳到结尾
  jumpToEnd = () => {
    this.player.seek(88)
  }

  canPlayThrough = e => {
    if (this.state.canPlayThrough === false) {
      console.log('缓存完毕! =>');
      this.setState({
        canPlayThrough: true
      })
      console.log("duration =>", e.target.duration);
      console.log("seekable =>", e.target.seekable.start(0), e.target.seekable.end(0));
      if(e.target.buffered.length > 0) {
        console.log("buffered =>", e.target.buffered.start(0), e.target.buffered.end(0));
      }
    }
    return
  }

  progress = e => {
    const { buffered, duration } = e.target
    if(buffered.length > 0) {
      const end = buffered.end(0)
      console.log(`buffered: ${end}`);
      if(end.toString() === duration.toString()) {
        console.log('视频缓存完毕');
      }
    }
  }

  // 阻止冒泡
  static stopPop = e => {
    e.stopPropagation()
  }

  // 阻止获得焦点
  static blurFn = e => {
    // 确保目标元素为video才取消获取焦点
    return e.target.className === "video-react-video" ? e.target.blur() : false
  }

  render() {
    const { width, height, fluid, autoplay, muted, src, poster, preload } = this.props
    const { muted: s_muted, duration, currentTime } = this.state.player
    return (
      <div className='container' onFocus={AdsVideo.blurFn} onProgress={this.progress} onCanPlayThrough={this.canPlayThrough} style={fluid ? { width: '500px' } : {}}>
        <div className='timeline'>{`${formatSeconds(currentTime)} / ${formatSeconds(duration)}`}</div>
        <div className='sound' onClick={this.setMuted}>{s_muted ? <span className='muted'>🔈X</span> : <span>🔈</span>}</div>
        <div className='video' ref={item => this.item = item}>
          <Player autoPlay={autoplay} width={width} height={height} muted={muted} ref={(player) => this.player = player} poster={poster} preload={preload} fluid={fluid} >
            <source src={src} />
            <ControlBar disabled />
            <BigPlayButton disabled />
          </Player>
        </div>
      </div>
    )
  }
}


AdsVideo.propTypes = {
  width: number,
  height: number,
  fluid: bool,
  autoplay: bool,
  muted: bool,
  src: string,
  poster: string,
  preload: oneOf(['none', 'auto', 'metadata']),
  onEnded: func,
  href: string
}

AdsVideo.defaultProps = {
  width: 500,
  height: 300,
  fluid: false,
  autoplay: false,
  muted: true,
  src: '',
  poster: '',
  preload: 'auto',
  onEnded: () => { },
  href: '/'
}