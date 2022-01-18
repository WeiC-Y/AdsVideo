import React, { useEffect, useRef, useState } from 'react'
import VideoJs from '../VideoJs'

export default function VideoPage() {

  const [player, setPlayer] = useState('')

  const video = useRef()

  const videoProps = {
    videoLoad: () => { console.log('视频开始播放时,发起网络请求') },
    videoEnded: () => { console.log('视频结束时(或播放时长达到条件时),发起网络请求') },
    videoClick: () => { console.log('视频广告被点击时,发起网络请求'); }
  }

  useEffect(() => {
    const fn = async () => {
      const { current: { video: newPlayer } } =await video
      setPlayer(newPlayer)
    }

    fn()
  }, [])

  return (
    <div>
      <div>
        <VideoJs {...videoProps} ref={video} />
      </div>
      <button onClick={() => { player.paused() ? player.play() : player.pause() }}>切换播放/暂停</button>
      <button onClick={() => { player.muted() ? player.muted(false) : player.muted(true) }}>切换静音</button>
    </div>
  )
}
