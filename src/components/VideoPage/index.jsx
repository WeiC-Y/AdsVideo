import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Progress from '../Progress';
import VideoJs from '../VideoJs'
import { formatSeconds } from '../../utils/dateFormat'

import { videoUrl } from '../../constant'

export default function VideoPage() {

  const [progress, setProgress] = useState('')

  const videoRef = useRef()
  const navigate = useNavigate()

  // 获取子组件暴露出来的方法 切换暂停与开始
  const changePaused = () => {
    const { current } = videoRef
    if (current) {
      current.togglePaused()
    }
  }

  // 切换静音
  const changeMuted = () => {
    const { current } = videoRef
    if (current) {
      current.toggleMuted()
    }
  }

  const videoClick = () => { console.log('视频广告被点击时,发起网络请求'); }
  const setPercent = value => setProgress(value)

  // 传递的参数
  const videoProps = {
    url: videoUrl,
    videoLoad: () => { console.log('视频开始播放时,发起网络请求') },
    videoEnded: () => { console.log('视频结束时(或播放时长达到条件时),发起网络请求') },
    setProgress: setPercent,
    maxDuration: 5  // 设置播放的最大时长，达到指定时长后发起请求
  }

  return (
    <div className='videoPage'>
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
      <a href='https://www.baidu.com' onClick={videoClick}><VideoJs {...videoProps} ref={videoRef} /></a>
      <Progress bgColor='#ccc' color="#234ddc" progress={`${progress}%`} />
      <button onClick={changePaused}>切换播放/暂停</button>
      {videoRef.current ? <div>
        <span>{formatSeconds(videoRef.current.duration - videoRef.current.currentTime)}</span>
        <span className='iconfont' onClick={changeMuted} dangerouslySetInnerHTML={{ __html: videoRef.current.muted ? '&#xe619;' : '&#xe61a;' }}></span>
      </div> : <div>
        <span>0:00</span>
        <span className='iconfont'>&#xe619;</span>
      </div>
      }
    </div >
  )
}
