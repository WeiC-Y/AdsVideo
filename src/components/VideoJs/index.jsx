import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import Videojs from 'video.js';
import 'videojs-contrib-hls'
import 'video.js/dist/video-js.css';
import './index.css'

window.videojs = Videojs
import('video.js/dist/lang/zh-CN')

// window.flag = false
let flag = false
let i = 0 //设置 视频源列表 索引值

const VideoJs = forwardRef((props, ref) => {

  const { videoLoad, videoEnded, setProgress, maxDuration, url } = props

  const container = useRef()
  const [video, setVideo] = useState('')
  const [currentTime, setCurrentTime] = useState(0) // 当前播放时间
  const [duration, setDuration] = useState(0) // 视频总时长
  const [muted, setMuted] = useState(true)

  const numberFormat = (num) => { // 将小数变为 精确到小数点后两位的百分数
    if (typeof num === 'number') {
      return (num.toFixed(4) * 100).toFixed(2)
    }
  }

  const togglePaused = () => { // 切换播放
    if (video) {
      video.paused() ? video.play() : video.pause()
    }
  }

  const toggleMuted = () => { // 切换静音
    if (video) {
      video.muted() ? video.muted(false) : video.muted(true)
    }
  }

  useEffect(() => {
    let player = null

    // 发生错误前触发的钩子函数
    Videojs.hook('beforeerror', (player, err) => {
      if (err !== null) {
        if (Array.isArray(url)) {
          player.src(url[++i])
        }
      }

      // 清除错误，避免 error 事件在控制台抛出错误
      return err
    })

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
        LoadProgressBar: true,
        controlBar: {
          PictureInPictureToggle: false,
        }
      }

      player = Videojs('AdsVideo', options)
      player.disablePictureInPicture(true)
      player.on(['loadstart', 'loadedalldata', 'loadeddata', 'play', 'pause', 'playing', 'timeupdate', 'volumechange', 'firstplay', 'ended'], e => {
        switch (e.type) {
          case 'loadstart':
            return;

          case 'loadeddata':
            setDuration(player.duration())
            return;

          case 'loadedalldata':
            return console.log('加载全部数据');

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
      player.src(src)
    }

    try {
      const src = Array.isArray(url) ? url[i] : url
      initVideo(src)
      setVideo(player)
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
      <video id='AdsVideo' className='video-js' playsInline x5-video-player-type="h5"></video>
    </div >
  )
}
)

export default VideoJs