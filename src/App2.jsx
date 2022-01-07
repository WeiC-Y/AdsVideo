// App.jsx
import React, { Component } from 'react';
import { Player } from 'video-react';
import path from './assets/1.mp4';
import './App2.css'
// 引入组件样式
import "../node_modules/video-react/dist/video-react.css";


export default class App extends Component {

  componentDidMount() {
    console.log(this.player)
    // subscribe state change 订阅状态改变
    this.player.subscribeToStateChange(this.handleStateChange.bind(this));
  }

  // 处理状态变化的事件
  handleStateChange(state, prevState) {
    console.log(state)
  }

  render() {
    return (
      <div className='container'>
        {/* 使用 ref 获取 player 实例对象，其中包含着组件的属性与方法 */}
        <Player ref={a => this.player = a} fluid={false} width={500} height={300}>
          <source src={path} />
        </Player>
      </div>
    );
  }
}