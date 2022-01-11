import React, { Component, Fragment } from 'react';
import { number, string, bool, oneOf, func, shape } from 'prop-types'
import {
  Player,
  ControlBar,
  BigPlayButton
} from 'video-react';
import { load, toPercent } from '../../utils/xhr'
import './index.css'
import "../../../node_modules/video-react/dist/video-react.css"; // import css


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

    this.player.play()
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
  onerror = (errorMsg) => {
    console.log(errorMsg);
    this.setState({
      errorMsg
    })
  }

  componentDidMount() {
    // 禁止右键菜单
    this.item.oncontextmenu = e => e.preventDefault()
    // Subscribe to the player state changes.
    this.player.subscribeToStateChange(this.setChange.bind(this))
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

    // 取消画中画
    const { video: { video: videoElm } } = this.player
    if (videoElm.disablePictureInPicture !== 'undefined') {
      videoElm.disablePictureInPicture = true
    }

    // 获取视频结束使得进度
    if (player.ended !== true) {
      this.props.setProgress(this.toPercent(player.currentTime, player.duration))
    }

    // 获取视频结束后的第一次进度
    if (this.state.player.ended !== true && player.ended === true) {
      this.props.setProgress(this.toPercent(player.currentTime, player.duration))
    }

    this.setState({
      player,
    })
  }

  // 开始发送网络请求（缓存视频）
  sendXHR = () => {
    let { flag } = this.state
    if (flag === false) {
      let xhr = load({
        url: this.props.video.url,
        method: 'GET',
        type: 'blob',
        time: 10000,
        success: this.onsuccess,
        error: this.onerror,
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
    const { to, onAdClick } = this.props
    onAdClick()
    if (to) {
      return window.location.href = to
    }
    return false
  }

  // 进度条长度
  toPercent = (currentTime, duration) => {
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
    const { video } = this.props
    const { player: { muted: s_muted, duration, currentTime }, blobUrl } = this.state
    return (
      <Fragment>
        <div
          className='container'
          onFocus={AdsVideo.blurFn}
          style={video.fluid ? { width: '100%' } : { width: `${video.width}px`, height: `${video.height}px` }}>
          <div className='timeline'>{duration ? `${Math.floor(duration - currentTime)}s` : `00:00`}</div>
          {blobUrl ? <div className='sound' onClick={this.setMuted}>
            <span className="iconfont" dangerouslySetInnerHTML={{ __html: s_muted ? '&#xe619;' : '&#xe61a;' }}></span>
          </div> : ''}
          <div className='video' ref={item => this.item = item} onClick={this.handleClick}>
            <Player ref={(player) => this.player = player} {...video}>
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
  video: shape({
    width: number,
    height: number,
    fluid: bool,
    autoplay: bool,
    muted: bool,
    url: string,
    poster: string,
    preload: oneOf(['none', 'auto', 'metadata']),
  }),
  to: string,
  onEnded: func,
  onLoad: func,
  onAdClick: func
}

AdsVideo.defaultProps = {
  video: {
    width: 500,
    height: 300,
    fluid: false,
    autoplay: false,
    muted: true,
    url: '',
    poster: '',
    preload: 'auto',
  },
  onEnded: () => { },
  onLoad: () => { },
  onAdClick: () => { }
}