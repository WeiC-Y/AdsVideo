import React, { Component, Fragment } from 'react';
import { number, string, bool, oneOf, func } from 'prop-types'
import {
  Player,
  ControlBar,
  BigPlayButton
} from 'video-react';
import { formatSeconds } from './utils/dateFormat'
import { load, toPercent } from './utils/xhr'
import './AdsVideo.css'
import "../node_modules/video-react/dist/video-react.css"; // import css


export default class AdsVideo extends Component {

  state = {
    flag: false,
    blobUrl: '',
    percent: 0,
    errorMsg: '获取资源中',
    player: {},
    canPlayThrough: false,
    xhr: load(this.props.src)
  }

  success = (e) => {
    const { xhr } = this.state
    if (xhr.status === 200) {
      this.setState({
        flag: true,
        blobUrl: URL.createObjectURL(xhr.response)
      })
      this.player.src = URL.createObjectURL(xhr.response)
    }
  }

  onprogress = e => {
    if (e.lengthComputable) {
      // 已经传输的字节数 / 总字节数
      const percent = toPercent(e.loaded / e.total)
      this.setState({
        percent
      })
    }
  }

  onerror = () => {
    this.setState({
      flag: false,
      errorMsg: '请求资源失败!'
    })
  }

  ontimeout = () => {
    this.setState({
      flag: false,
      errorMsg: '请求资源超时!'
    })
  }

  componentDidMount() {
    const { xhr } = this.state
    xhr.timeout = 10000
    xhr.onload = this.success
    xhr.onprogress = this.onprogress
    xhr.onerror = this.onerror
    xhr.ontimeout = this.ontimeout

    xhr.send()

    this.item.oncontextmenu = e => e.preventDefault()
    // Subscribe to the player state changes.
    this.player.subscribeToStateChange(this.setChange.bind(this))
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
    console.log("player =>", player);
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
    const { width, height, fluid, autoplay, muted, poster, preload } = this.props
    const { player: { muted: s_muted, duration, currentTime }, blobUrl, percent } = this.state
    return (
      <Fragment>
        <h2>获取资源中: {percent}</h2>
        <div className='container' onFocus={AdsVideo.blurFn} style={fluid ? { width: '500px' } : {}}>
          <div className='timeline'>{`${formatSeconds(currentTime)} / ${formatSeconds(duration)}`}</div>
          <div className='sound' onClick={this.setMuted}>{s_muted ? <span className='muted'>🔈X</span> : <span>🔈</span>}</div>
          <div className='video' ref={item => this.item = item}>
            <Player autoPlay={autoplay} width={width} height={height} muted={muted} ref={(player) => this.player = player} poster={poster} preload={preload} fluid={fluid} >
              <source src={blobUrl}></source>
              <ControlBar disabled />
              <BigPlayButton disabled />
            </Player>
          </div>
        </div>
      </Fragment>

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
  onEnded: () => { }
}