import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import Videojs from 'video.js';
import 'videojs-contrib-hls'
import 'video.js/dist/video-js.css';
import './index.css'

import { videoUrl } from '../../constant'

window.videojs = Videojs
import('video.js/dist/lang/zh-CN')

const VideoJs = forwardRef((props, ref) => {

  const container = useRef()
  const [video, setVideo] = useState('')
  const [percent, setPercent] = useState(0)  // 播放进度
  const [currentTime, setCurrentTime] = useState(0) // 当前播放时间
  const [duration, setDuration] = useState(0) // 视频总时长

  function numberFormat(num) {
    if (typeof num === 'number') {
      return (num.toFixed(4) * 100).toFixed(2)
    }
  }

  useEffect(() => {
    console.log('props =>', props);

    let player = null

    // 初始化视频
    function initVideo(src) {

      // 初始化播放器时取消controls，将无法使用鼠标控制视频播放
      let options = {
        controls: true,  // 控制栏
        preload: 'auto',
        fluid: false,
        disablePictureInPicture: true,  // 画中画
        loadingSpinner: false,  // 加载中图标
        // autoplay: true,
        bigPlayButton: false,  // 大的播放按钮
        controlBar: {
          pictureInPictureToggle: false
        }
      }

      player = Videojs('AdsVideo', options)

      player.on(['loadstart', 'loadeddata', 'play', 'pause', 'playing', 'timeupdate', 'firstplay', 'ended'], e => {
        switch (e.type) {
          case 'loadstart':
            return console.log('开始加载数据');
          case 'loadeddata':
            setDuration(player.duration())
            return console.log('加载数据成功');
          case 'firstplay':
            // 第一次播放时发起网络请求
            return console.log('第一次播放');
          case 'playing':
            return console.log('播放中...');
          case 'timeupdate':
            setCurrentTime(player.currentTime())
            setPercent(numberFormat(player.currentTime() / player.duration()))
            return console.log('播放时间改变...');
          case 'play':
            return console.log('视频播放');
          case 'pause':
            return console.log('视频暂停');
          case 'ended':
            return console.log('视频结束');
          default:
            return false;
        }
      })
      player.src({ src })
    }

    try {
      initVideo('https://d2zihajmogu5jn.cloudfront.net/tears-of-steel/2040k/file-2040k.m3u8')
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
  useImperativeHandle(ref, () => ({ video }));

  return (
    <div className='container' ref={container} onContextMenu={e => e.preventDefault()}>
      <video id='AdsVideo' className='video-js' playsInline></video>
      <div className='progressBar'>
        <div className='progress' style={{ width: `${percent}%` }}></div>
      </div>
      <div>{`${currentTime} / ${duration}`}</div>
    </div>
  )
}
)

export default VideoJs