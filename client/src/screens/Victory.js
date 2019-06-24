import React from 'react';
import {Helmet} from 'react-helmet';

const color = {navy:'#33658A',sky:'#86BBD8',bean:'#758E4F',sunflower:'#F6AE2D',oranje:'#F26219'};
function Victory() {
  const victoryStyle = {
    position: 'absolute', 
    left: '50%', 
    top: '45%',
    transform: 'translate(-50%, -50%)'
  };
  return (
    <div className="App" style={victoryStyle}>
      <Helmet>
        <title>Victory!</title>
        <style>{'body { background-color: #758E4F; }'}</style>
      </Helmet>
      <h2>Congrats, you are GOATED on the Trivia</h2>
      <p>See you again on the battlefield, champion</p>
      <img src="https://pbs.twimg.com/profile_images/978399767922266112/JPDlwZve_400x400.jpg" alt="Literally Goated"/>
    </div>
  );
}

export default Victory;