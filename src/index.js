import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import AdsPage from './components/AdsPage';
import VideoJs from './components/VideoJs';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import 'core-js/es'
import 'react-app-polyfill/ie9' 
import 'react-app-polyfill/stable'

ReactDOM.render(
  <Router>
    <Routes>
      <Route path='/' element={<App />}/>
      <Route path='/ads' element={<AdsPage />}/>
      <Route path='/video' element={<VideoJs />}/>
    </Routes>
  </Router>
  ,document.getElementById('root'));