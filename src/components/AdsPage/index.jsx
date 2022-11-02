import React, { Component } from 'react'
import AdsVideo from '../AdsVideo';
// import path from './assets/4.mp4'

export default class App extends Component {

  componentDidMount() {
    // 自动加载视频
    this.video.sendXHR();
  }

  onload = () => {
    this.video.sendXHR();
  }

  paused = () => {
    this.video.togglePaused();
  }

  muted = () => {
    this.video.setMuted();
  }

  // 跳到视频结尾
  jumpToEnd = () => {
    this.video.jumpToEnd();
  }

  // 以下为响应事件
  // 视频播放结束回调函数
  onEnded = () => {
    console.log("发送请求？");
  }

  // 视频第一次载入
  onLoad = () => {
    console.log("视频加载成功");
  }

  // 点击事件
  onAdClick = () => {
    console.log("广告被点击了");
  }

  videoProps = {
    video: {
      width: 700,
      height: 500,
      // url: 'https://rr1---sn-oguesn6r.googlevideo.com/videoplayback?expire=1640883263&ei=34_NYcWAGcTS2roPk--RgAE&ip=50.7.14.44&id=o-AIhBpL5slY5BNHR_52pK2QpZ054T7KMNDhQRVnmfsI7C&itag=18&source=youtube&requiressl=yes&hcs=ir%2C&mh=Nb&mm=31%2C26&mn=sn-oguesn6r%2Csn-npoeens7&ms=au%2Conr&mv=m&mvi=1&pl=24&rmhost=rr2---sn-oguesn6r.googlevideo.com%2C&initcwndbps=921250&vprv=1&mime=video%2Fmp4&ns=4lPxwfB9UHs0HbpgEsO6-FYG&gir=yes&clen=1682507&ratebypass=yes&dur=30.069&lmt=1639943783514269&mt=1640861336&fvip=2&fexp=24001373%2C24007246&c=MWEB&txp=5530434&n=JVbKzX6HuYSfWA&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cns%2Cgir%2Cclen%2Cratebypass%2Cdur%2Clmt&sig=AOq0QJ8wRQIhAJZ1t2QeTJmKeYfE19MMPd92qax0yPMd-ci2iiJGG4H6AiBWDG0DTGzeBF1Xx-NVizfLO5rG2HVI2GnVjvn1hyC63w%3D%3D&lsparams=hcs%2Cmh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Crmhost%2Cinitcwndbps&lsig=AG3C_xAwRAIgX2OJoFet7ZuXLM9a8kOhAOGAtzrX0uwL5l0sC1yjn6oCIEgDQLl9iLv5_2OEp5lCHqIUrEtMlDDnjawlnC4c7D3x&cpn=ZXNsv-nI-WFCpR4e&cver=2.20211221.01.00&ptk=youtube_host&ptchn=youtube_host&pltype=adnohost',
      // url: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
      // url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      // url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      url: 'http://10.45.98.130:1000/video/4.mp4',
      autoPlay: true,
      fluid: false,
    },
    to: 'https://www.baidu.com',
    onEnded: this.onEnded,
    onLoad: this.onLoad,
    onAdClick: this.onAdClick
  }

  render() {
    return (
      <div>
        <AdsVideo ref={video => this.video = video} {...this.videoProps} />
        <div>
          <button onClick={this.load}>onLoad</button>
          <button onClick={this.paused}>开始/暂停</button>
          <button onClick={this.muted}>切换静音</button>
          <button onClick={this.jumpToEnd}>跳到结尾</button>
        </div>
      </div>
    )
  }
}
