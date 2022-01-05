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
    progress: '',
    errorMsg: '获取资源中',
    player: {},
    blobUrl: ''
  }

  // 网络请求成功后的回调函数
  onsuccess = (res) => {
    this.setState({
      flag: true,
      blobUrl: URL.createObjectURL(res)
    })

    // 转换响应数据为 blob视频格式 并传递给视频组件
    this.source.src = URL.createObjectURL(res)

    // 重新加载视频
    this.player.load()

    // 视频加载完毕后触发事件
    this.props.onLoad()
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
      errorMsg: '请求资源失败!'
    })
  }

  // 网络请求超时的回调函数
  ontimeout = () => {
    this.setState({
      errorMsg: '请求资源超时!'
    })
  }

  componentDidMount() {
    // 禁止右键菜单
    this.item.oncontextmenu = e => e.preventDefault()
    // Subscribe to the player state changes.
    this.player.subscribeToStateChange(this.setChange.bind(this))

    // 取消画中画
    this.player.disablePictureInPicture = true
    const { video: { video: videoElm } } = this.player
    videoElm.disablePictureInPicture = true
  }

  // 观察视频的状态
  setChange() {
    const { blobUrl } = this.state
    const { player } = this.player.getState()

    // 当视频资源存在时，blobUrl不为空
    if (blobUrl !== '') {

      // 根据视频时长进入不同分支
      if (player.duration < 30) {
        if (player.ended !== this.state.player.ended && player.ended === true) {
          // 视频首次结束触发
          console.log("视频小于30s且视频结束");
          this.props.onEnded()
        }
      } else if (player.duration > 30) {
        if (player.currentTime > 30 && this.state.player.currentTime < 30) {
          console.log("视频大于30s且视频播放超过30s");
          this.props.onEnded()
        }
      }
    }

    this.setState({
      player,
      progress: this.toPercent()
    })
  }

  // 开始发送网络请求（缓存视频）
  sendXHR = () => {
    let { flag } = this.state
    if (flag === false) {
      let xhr = load({
        url: this.props.src,
        method: 'GET',
        type: 'blob',
        time: 10000,
        success: this.onsuccess,
        error: this.onerror,
        timeout: this.ontimeout,
        progress: this.onprogress
      })
      xhr.send()
    }
    else {
      this.setState({
        errorMsg: 'xhr must be opend!'
      })
    }
  }

  // 切换视频暂停
  togglePaused = () => {
    if (this.source.src) {
      const { player: { paused } } = this.player.getState()
      paused ? this.player.play() : this.player.pause()
    } else {
      console.log('视频尚未加载');
      return false
    }
  }

  // 切换视频静音
  setMuted = () => {
    if (this.source.src) {
      this.player.muted = !this.player.muted
    } else {
      console.log('视频尚未加载');
      return false
    }
  }

  // 跳到结尾
  jumpToEnd = () => {
    this.player.seek(this.state.player.duration - 1)
  }

  // 跳转链接地址
  handleClick = () => {
    const { url, onAdClick } = this.props
    onAdClick()
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
    const { player: { muted: s_muted, duration, currentTime }, percent, errorMsg, blobUrl, progress, flag } = this.state
    return (
      <Fragment>
        <h2>{errorMsg === '获取资源中' ? `${errorMsg}: ${percent}` : errorMsg}</h2>
        <div className={flag === true ? 'container' : 'contianer hidden'} onFocus={AdsVideo.blurFn} style={fluid ? { width: '500px' } : { width: `${width}px`, height: `${height}px` }}>
          <div className="progressBar">
            <div className="progress" style={{ width: progress }}></div>
          </div>
          <div className='timeline'>{duration ? `${formatSeconds(duration - currentTime)}` : `00:00`}</div>
          {blobUrl ? <div className='sound' onClick={this.setMuted}>
            <span className="iconfont" dangerouslySetInnerHTML={{ __html: s_muted ? '&#xe63b;' : '&#xe63a;' }}></span>
          </div> : ''}
          <div className='video' ref={item => this.item = item} onClick={this.handleClick}>
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
  url: string,
  onEnded: func,
  onLoad: func,
  onAdClick: func
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
  onLoad: () => { },
  onAdClick: () => { }
}