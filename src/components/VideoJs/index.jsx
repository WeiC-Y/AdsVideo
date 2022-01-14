import React, { useEffect } from 'react';
import Videojs from 'video.js';
import 'video.js/dist/video-js.css';

export default function VideoJs() {

  let player = null

  function initVideo(src) {
    player = Videojs('AdsVideo4123', {
      height: 300,
      width: 500,
      controls: true,
      preload: 'auto',
      fluid: false
    })

    player.src({ src })
  }

  useEffect(() => {
    return () => {
      if (player) {
        player.dispose()
      }
    }
  }, [])

  return (
    <div>
      <video id='AdsVideo'></video>
    </div>
  )
}
