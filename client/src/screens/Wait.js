import React from 'react';
import {Helmet} from 'react-helmet';

const color = {navy:'#33658A',sky:'#86BBD8',bean:'#758E4F',sunflower:'#F6AE2D',oranje:'#F26219'};
function Wait() {
  return (
    <div className="App">
      <Helmet>
        <title>Rest Up, Warrior</title>
        <style>{'body { background-color: #86BBD8; }'}</style>
      </Helmet>
      <h1>timeLeft</h1>
      <h2>You have won your battle, but not the war</h2>
      <h3>correctChoice</h3>
      <p>Prepare for your next endeavor</p>
      <img src="https://i.kym-cdn.com/photos/images/original/001/248/330/675.jpg" alt="ResidentSleep"/>
    </div>
  );
}

export default Wait;