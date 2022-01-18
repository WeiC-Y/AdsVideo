import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';

import AdsVideo from '../AdsVideo';
import Progress from '../Progress';

import { videoUrl } from '../../constant'
import './index.css'

export default function AdsPage() {

  const navigate = useNavigate()

  const [progress, setProgress] = useState('')
  const [flag, setFlag] = useState(false)

  const video = useRef()

  const getProgress = value => {
    setProgress(value)
  }

  const getFlag = () => {
    setFlag(true)
  }

  useEffect(() => {
    console.log("componentDidMount ? useEffect !");
  }, [])


  // const paused = () => {
  //   this.video.togglePaused()
  // }

  // const muted = () => {
  //   this.video.setMuted()
  // }

  // 以下为响应事件
  // 视频播放结束回调函数
  const onEnded = () => {
    console.log("发送请求？");
  }

  // 视频第一次载入
  const onLoad = () => {
    console.log("视频加载成功");
  }

  // 点击事件
  const onAdClick = () => {
    console.log("广告被点击了");
  }

  const videoProps = {
    video: {
      // url: 'https://d2zihajmogu5jn.cloudfront.net/tears-of-steel/2040k/file-2040k.m3u8',
      url: videoUrl, // 这是一分钟的视频
      // url: 'http://localhost:1000/15s/temp.m3u8', // 这是15秒的视频
      autoPlay: true,
      fluid: true,
      muted: true
    },
    to: 'https://www.baidu.com',
    onEnded: onEnded,
    onLoad: onLoad,
    onAdClick: onAdClick,
    setProgress: getProgress,
    setFlag: getFlag,
    flag: flag
  }

  return (
    <div className='videoPage'>
      <span className="top">
        <div className='back' onClick={() => { navigate(-1); console.log("点击了返回") }}>
          <span className='iconfont'>&#xe65d;</span>
        </div>

        <div className="downloadApp">
          <div className="left">
            <img src={require('../../assets/R.jpg')} alt="" />
            <div className="txt">
              <h4 className="title">City Mall Online</h4>
              <span className="author">by citymall. org</span>
            </div>
          </div>
          <div className="right">
            <button>Download</button>
          </div>
        </div>
      </span>
      {flag ? <AdsVideo ref={video} {...videoProps} /> : <AdsVideo ref={video} {...videoProps} style={{ display: 'none' }} />}
      <Progress bgColor='#ccc' color="#234ddc" progress={progress} />
    </div>
  )
}
