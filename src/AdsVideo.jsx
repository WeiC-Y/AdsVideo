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
    flag: true,
    percent: 0,
    errorMsg: '获取资源中',
    player: {},
    xhr: load(this.props.src),
    blobUrl: ''
  }

  // 网络请求成功后的回调函数
  success = (e) => {
    const { xhr } = this.state
    if (xhr.status === 200) {
      this.setState({
        flag: false,
        blobUrl: URL.createObjectURL(xhr.response)
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
    // 禁止右键菜单
    this.item.oncontextmenu = e => e.preventDefault()
    // Subscribe to the player state changes.
    this.player.subscribeToStateChange(this.setChange.bind(this))
    this.player.disablePictureInPicture = true
    const { video: { video: videoElm } } = this.player
    videoElm.disablePictureInPicture = true
  }

  componentDidUpdate(preProps, preState) {
    if (this.state.player.ended !== preState.player.ended) {
      if (this.source.src && this.state.player.ended === true) {
        this.props.onEnded()
      }
    }
    return true
  }

  // 开始发送网络请求（缓存视频）
  sendXHR = () => {
    const { xhr, flag } = this.state
    if (flag) {
      xhr.timeout = 20000
      xhr.onload = this.success
      xhr.onprogress = this.onprogress
      xhr.onerror = this.onerror
      xhr.ontimeout = this.ontimeout
      xhr.send()
    }
    else {
      this.setState({
        errorMsg: 'xhr must be opend!'
      })
    }
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
    if (this.source.src) {
      const { player: { paused } } = this.player.getState()
      paused ? this.player.play() : this.player.pause()
    } else {
      return false
    }

  }

  // 切换视频静音
  setMuted = () => {
    if (this.source.src) {
      this.player.muted = !this.player.muted
    } else {
      return false
    }
  }

  // 跳到结尾
  jumpToEnd = () => {
    this.player.seek(29)
  }

  // 跳转链接地址
  gotoUrl = () => {
    const { url } = this.props
    if (url) {
      return window.location.href = this.props.url
    }
    return false
  }

  // 进度条长度
  toPercent = () => {
    const { duration, currentTime } = this.state.player
    const num = Number(((currentTime / duration) * 100).toFixed(2))                     
    return duration && currentTime ? num + '%' : '0%'
  }
f
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
    const { player: { muted: s_muted, duration, currentTime }, percent, errorMsg, blobUrl } = this.state
    return (
      <Fragment>
        <h2>{errorMsg === '获取资源中' ? `${errorMsg}: ${percent}` : errorMsg}</h2>
        <div className='container' onFocus={AdsVideo.blurFn} style={fluid ? { width: '500px' } : {}}>
          <div className="progressBar">
            <div className="progress" style={{ width: `${this.toPercent()}` }}></div>
          </div>
          <div className='timeline'>{duration ? `${formatSeconds(duration - currentTime)}` : `00:00`}</div>
          {blobUrl ? <div className='sound' onClick={this.setMuted}>
            {
              s_muted ? <span className="iconfont">&#xe63b;</span> : <span className="iconfont">&#xe63a;</span>
            }
          </div> : ''}
          <div className='video' ref={item => this.item = item} onClick={this.gotoUrl}>
            <Player autoPlay={autoplay} width={width} height={height} muted={muted} ref={(player) => this.player = player} poster={poster} preload={preload} fluid={fluid} >
              <source ref={a => this.source = a}></source>
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
  url: string
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
  string: ''
}