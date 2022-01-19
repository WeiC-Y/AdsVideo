import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import Videojs from 'video.js';
import 'videojs-contrib-hls'
import 'video.js/dist/video-js.css';
import './index.css'

window.videojs = Videojs
import('video.js/dist/lang/zh-CN')

// window.flag = false
let flag = false
const VideoJs = forwardRef((props, ref) => {

  const container = useRef()
  const [video, setVideo] = useState('')
  const [currentTime, setCurrentTime] = useState(0) // 当前播放时间
  const [duration, setDuration] = useState(0) // 视频总时长
  const [muted, setMuted] = useState(true)

  const numberFormat = (num) => {
    if (typeof num === 'number') {
      return (num.toFixed(4) * 100).toFixed(2)
    }
  }

  const togglePaused = () => {
    if (video) {
      video.paused() ? video.play() : video.pause()
    }
  }

  const toggleMuted = () => {
    if (video) {
      video.muted() ? video.muted(false) : video.muted(true)
    }
  }

  useEffect(() => {
    const { videoLoad, videoEnded, setProgress, maxDuration, url } = props
    let player = null

    // 初始化视频
    async function initVideo(src) {

      // 初始化播放器时取消controls，将无法使用鼠标控制视频播放
      let options = {
        controls: false,  // 控制栏
        preload: 'auto',
        fluid: false,
        loadingSpinner: false,  // 加载中图标
        autoplay: 'muted',
        bigPlayButton: false,  // 大的播放按钮,
        disabledPictureInPicture: true,
        controlBar: {
          PictureInPictureToggle: false
        }
      }

      player = Videojs('AdsVideo', options)

      player.on(['loadstart', 'loadeddata', 'play', 'pause', 'playing', 'timeupdate', 'volumechange', 'firstplay', 'ended'], e => {
        switch (e.type) {
          case 'loadstart':
            return;

          case 'loadeddata':
            setDuration(player.duration())
            return;

          case 'firstplay':
            // 第一次播放时发起网络请求
            videoLoad()
            return;

          case 'playing':
            return;

          case 'timeupdate':
            // 当播放时长发生改变时才会触发，所以 currentTime 不会为空
            if (Math.floor(player.currentTime()) === maxDuration) {
              if (!flag) {
                videoEnded()
                flag = true
              }
            }

            setCurrentTime(player.currentTime())
            setProgress(numberFormat(player.currentTime() / player.duration()))
            return;


          case 'volumechange':
            setMuted(player.muted())
            return;
          case 'play':
            return;

          case 'pause':
            return;

          case 'ended':
            if (!maxDuration || maxDuration > player.duration()) {
              // 当不指定播放时长条件时，默认播放结束后发起请求
              // 或当指定时长大于视频时长时，视频播放结束发情请求
              // 当视频时长小于30s时，需要播放结束才发送请求
              videoEnded()
            }
            return;

          default:
            return false;
        }
      })
      player.src({ src })
    }

    try {
      initVideo(url)
      setVideo(player)
      console.log(player.playsinline());
    } catch (err) {
      console.log(err);
    }

    return () => {
      if (player) {
        player.dispose()
      }
    }
  }, [])

  // 向父组件传递 video 实例
  useImperativeHandle(ref, () => ({ toggleMuted, togglePaused, currentTime, duration, muted }));

  return (
    <div className='container' ref={container} onContextMenu={e => e.preventDefault()}>
      <video id='AdsVideo' className='video-js' playsInline></video>
    </div>
  )
}
)

export default VideoJs