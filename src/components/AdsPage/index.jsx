import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';

import AdsVideo from '../AdsVideo';
import Progress from '../Progress';

import './index.css'
import path from '../../assets/4.mp4'

export default function AdsPage() {

  const navigate = useNavigate()

  const [progress, setProgress] = useState('')

  const video = useRef()

  const getProgress = value => {
    setProgress(value)
  }

  useEffect(() => {
    console.log(video);
    video.current.sendXHR()
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
      // url: 'https://rr1---sn-oguesn6r.googlevideo.com/videoplayback?expire=1640883263&ei=34_NYcWAGcTS2roPk--RgAE&ip=50.7.14.44&id=o-AIhBpL5slY5BNHR_52pK2QpZ054T7KMNDhQRVnmfsI7C&itag=18&source=youtube&requiressl=yes&hcs=ir%2C&mh=Nb&mm=31%2C26&mn=sn-oguesn6r%2Csn-npoeens7&ms=au%2Conr&mv=m&mvi=1&pl=24&rmhost=rr2---sn-oguesn6r.googlevideo.com%2C&initcwndbps=921250&vprv=1&mime=video%2Fmp4&ns=4lPxwfB9UHs0HbpgEsO6-FYG&gir=yes&clen=1682507&ratebypass=yes&dur=30.069&lmt=1639943783514269&mt=1640861336&fvip=2&fexp=24001373%2C24007246&c=MWEB&txp=5530434&n=JVbKzX6HuYSfWA&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cns%2Cgir%2Cclen%2Cratebypass%2Cdur%2Clmt&sig=AOq0QJ8wRQIhAJZ1t2QeTJmKeYfE19MMPd92qax0yPMd-ci2iiJGG4H6AiBWDG0DTGzeBF1Xx-NVizfLO5rG2HVI2GnVjvn1hyC63w%3D%3D&lsparams=hcs%2Cmh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Crmhost%2Cinitcwndbps&lsig=AG3C_xAwRAIgX2OJoFet7ZuXLM9a8kOhAOGAtzrX0uwL5l0sC1yjn6oCIEgDQLl9iLv5_2OEp5lCHqIUrEtMlDDnjawlnC4c7D3x&cpn=ZXNsv-nI-WFCpR4e&cver=2.20211221.01.00&ptk=youtube_host&ptchn=youtube_host&pltype=adnohost',
      // url: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
      // url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      // url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      url: path,
      autoPlay: true,
      fluid: true,
      muted: true
    },
    to: 'https://www.baidu.com',
    onEnded: onEnded,
    onLoad: onLoad,
    onAdClick: onAdClick,
    setProgress: getProgress
  }

  return (
    <div className='adsPage'>
      <div className="top">
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
      </div>
      <AdsVideo ref={video} {...videoProps} />
      <Progress bgColor='#ccc' color="#234ddc" progress={progress} />
    </div>
  )
}
