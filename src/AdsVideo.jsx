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
    percent: 0,
    errorMsg: '获取资源中',
    player: {},
    canPlayThrough: false,
    xhr: load(this.props.src)
  }

  // 网络请求成功后的回调函数
  success = (e) => {
    const { xhr } = this.state
    if (xhr.status === 200) {
      this.setState({
        flag: true
      })
      this.source.src = URL.createObjectURL(xhr.response)
      this.player.load()
    }
  }

  // 用于获取网络请求数据
  onprogress = e => {
    if (e.lengthComputable) {
      // 已经传输的字节数 / 总字节数
      const percent = toPercent(e.loaded / e.total)
      this.setState({
        percent
      })
    }
  }

  // 网络请求错误的回调
  onerror = () => {
    this.setState({
      flag: false,
      errorMsg: '请求资源失败!'
    })
  }

  // 网络请求超时的回调函数
  ontimeout = () => {
    this.setState({
      flag: false,
      errorMsg: '请求资源超时!'
    })
  }

  componentDidMount() {
    this.createXHR()
    // 禁止右键菜单
    this.item.oncontextmenu = e => e.preventDefault()
    // Subscribe to the player state changes.
    this.player.subscribeToStateChange(this.setChange.bind(this))
    console.log(this.state.xhr);
  }

  componentDidUpdate(preProps, preState) {
    if (this.state.player.ended !== preState.player.ended) {
      if (this.source.src && this.state.player.ended === true) {
        this.props.onEnded()
      }
    }
    return true
  }

  // 设置 xhr 对象
  createXHR = () => {
    const { xhr } = this.state
    xhr.timeout = 10000
    xhr.onload = AdsVideo.success
    xhr.onprogress = AdsVideo.onprogress
    xhr.onerror = AdsVideo.onerror
    xhr.ontimeout = AdsVideo.ontimeout
  }

  // 开始发送网络请求（缓存视频）
  sendXHR = () => {
    const { xhr } = this.state
    console.log(xhr);
  }

  // 观察视频的状态
  setChange() {
    const { player } = this.player.getState()
    this.setState({
      player
    })
  }

  // 切换视频暂停
  togglePaused = () => {
    const { player: { paused } } = this.player.getState()
    paused ? this.player.play() : this.player.pause()
  }

  // 切换视频静音
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
    const { player: { muted: s_muted, duration, currentTime }, percent } = this.state
    return (
      <Fragment>
        <h2>获取资源中: {percent}</h2>
        <div className='container' onFocus={AdsVideo.blurFn} style={fluid ? { width: '500px' } : {}}>
          <div className='timeline'>{`${formatSeconds(currentTime)} / ${formatSeconds(duration)}`}</div>
          <div className='sound' onClick={this.setMuted}>{s_muted ? <span className='muted'>🔈X</span> : <span>🔈</span>}</div>
          <div className='video' ref={item => this.item = item}>
            <Player autoPlay={autoplay} width={width} height={height} muted={muted} ref={(player) => this.player = player} poster={poster} preload={preload} fluid={fluid} >
              <source ref={a => this.source = a}></source>
              <ControlBar />
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