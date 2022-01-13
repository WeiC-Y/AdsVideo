import React, { Component, Fragment } from 'react';
import { number, string, bool, oneOf, func, shape } from 'prop-types'
import {
  Player,
  ControlBar,
  BigPlayButton
} from 'video-react';
import Hls from 'hls.js';
import './index.css'
import "../../../node_modules/video-react/dist/video-react.css"; // import css


export default class AdsVideo extends Component {

  state = {
    progress: '',
    player: {},
    loadFlag: true, // 标记视频是否为第一次加载
    endFlag: true // 标记视频是否为第一次结束
  }

  componentDidMount() {

    const that = this
    const { video: { video: videoElm } } = this.player

    videoElm.addEventListener('playing', function () {
      if (that.state.loadFlag) that.props.onLoad()
      that.setState({
        flag: false
      })
    })

    if (Hls.isSupported()) {
      const hls = new Hls()
      this.hls = hls
      hls.loadSource(this.props.video.url)
      hls.attachMedia(videoElm)

      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        that.props.setFlag()
        this.player.play()
      })
    }
    // 禁止右键菜单
    this.item.oncontextmenu = e => e.preventDefault()
    // Subscribe to the player state changes.
    this.player.subscribeToStateChange(this.setChange.bind(this))
  }

  // 观察视频的状态
  setChange() {
    const { player: prePlayer, endFlag } = this.state
    const { player } = this.player.getState()
    const { currentSrc } = player
    // 当视频资源存在时，blobUrl不为空
    if (currentSrc !== '') {

      // 根据视频时长进入不同分支
      if (player.duration < 30) {

        // 当前视频状态结束
        if (prePlayer.ended === true) {
          if (endFlag) {
            // 视频首次结束触发
            console.log("视频小于30s且视频结束");
            this.props.onEnded()
          }
          // 设置 endFlag 为true,
          this.setState({
            endFlag: false
          })

        }
      } else if (player.duration > 30) {
        // 视频时长大于 30s 时，当视频播放超过 30s，触发 onEnded
        if (prePlayer.currentTime > 30) {
          if (endFlag) {
            console.log("视频大于30s且视频播放超过30s");
            this.props.onEnded()
          }

          this.setState({
            endFlag: false
          })
        }
      }
    }

    // 取消画中画
    const { video: { video: videoElm } } = this.player
    if (videoElm.disablePictureInPicture !== 'undefined') {
      videoElm.disablePictureInPicture = true
    }

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


  // 切换视频暂停
  togglePaused = () => {
    if (this.props.flag) {
      const { player: { paused } } = this.player.getState()
      paused ? this.player.play() : this.player.pause()
    } else {
      console.log('视频尚未加载');
      return false
    }
  }

  // 切换视频静音
  setMuted = () => {
    if (this.props.flag) {
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

  // 小数转换百分数
  convert = (num) => {
    const str = Number(num * 100).toFixed(0)
    return str
  }

  // 进度条长度
  toPercent = (currentTime, duration) => {
    const num = Number(((currentTime / duration) * 100).toFixed(2))
    return duration && currentTime ? num + '%' : '0%'
  }

  // 阻止获得焦点
  static blurFn = e => {
    // 确保目标元素为video才取消获取焦点
    return e.target.className === "video-react-video" ? e.target.blur() : false
  }

  render() {
    const { video } = this.props
    const { player: { muted: s_muted, duration, currentTime } } = this.state
    return (
      <Fragment>
        <div
          className='container'
          onFocus={this.blurFn}
          style={video.fluid ? { width: '100%' } : { width: `${video.width}px`, height: `${video.height}px` }}>
          <div className='timeline'>{duration ? `${Math.floor(duration - currentTime)}s` : `00:00`}</div>
          {video.url ? <div className='sound' onClick={this.setMuted}>
            <span className="iconfont" dangerouslySetInnerHTML={{ __html: s_muted ? '&#xe619;' : '&#xe61a;' }}></span>
          </div> : ''}
          <div className='video' ref={item => this.item = item} onClick={this.handleClick}>
            <Player ref={(player) => this.player = player} {...video}>
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