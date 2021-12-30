import React, { Component } from 'react'
import { Player, ControlBar } from 'video-react'
import preloadIt from 'preload-it'
import path from './assets/2.mp4'
import './App.css'
import "../node_modules/video-react/dist/video-react.css"; // import css


const preload = new preloadIt()

export default class App extends Component {
  state = {
    progress: 0,
  }

  componentDidMount() {
    preload.fetch([
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
    ])

    preload.oncomplete = this.onComplete
    preload.onprogress = this.onProgress
    preload.onfetched = this.onfetched
  }

  onComplete = items => {
    this.source.src = preload.getItemByUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4').blobUrl
    this.setState({
      blobUrl: preload.getItemByUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4').blobUrl
    })
    this.player.load()
  }

  onProgress = event => {
    this.setState({
      progress: event.progress
    })
  }

  onfetched = item => {
    this.loadedAssets.innerHTML += `<p>${item.fileName} [<strong>${item.size}</strong>]<p/>`
  }


  render() {
    const { progress, blobUrl } = this.state
    return (
      <div className='box'>
        <div ref={a => this.progress = a} className="txt">{progress}%</div>
        <div ref={a => this.progressBar = a} style={{ width: `${progress * 5}px` }} className="line"></div>
        <div ref={a => this.loadedAssets = a} className="assets">
          <h3>Loaded Assets：</h3>
        </div>
        <div className='container'>
          <Player ref={a => this.player = a}>
            <source ref={a => this.source = a}/>
            <ControlBar />
          </Player>
        </div>
      </div>
    )
  }
}
