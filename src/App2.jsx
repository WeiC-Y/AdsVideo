import React, { Component } from 'react'
import preloadIt from 'preload-it'
import path from './2.mp4'
import './app.css'


const preload = new preloadIt()

export default class App extends Component {
  state = {
    progress: 0
  }

  componentDidMount() {
    preload.fetch([
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      path
    ])

    preload.oncomplete = this.onComplete
    preload.onprogress = this.onProgress
    preload.onfetched = this.onfetched
  }

  onComplete = items => {
    console.log(items);
    this.player.src = preload.getItemByUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4').blobUrl;
    this.player.play()
  }

  onProgress = event => {
    this.setState({
      progress: event.progress
    })
    console.log(event.progress, this.state.progress);
  }

  onfetched = item => {
    this.loadedAssets.innerHTML += `<p>${item.fileName} [<strong>${item.size}</strong>]<p/>`
  }


  render() {
    const { progress } = this.state
    return (
      <div className='box'>
        <div ref={a => this.progress = a} className="txt">{progress}%</div>
        <div ref={a => this.progressBar = a} style={{width: `${progress*5}px`}} className="line"></div>
        <div ref={a => this.loadedAssets = a} className="assets">
          <h3>Loaded Assets：</h3>
        </div>
        <div className='container'>
          <video ref={a => this.player = a} controls></video>
        </div>
      </div>
    )
  }
}
