import React from 'react';
import {Helmet} from 'react-helmet';
const color = {navy:'#33658A',sky:'#86BBD8',bean:'#758E4F',sunflower:'#F6AE2D',oranje:'#F26219'};
function Lost() {
  return (
    <div className="App">
      <Helmet>
        <title>You Have Been Defeated</title>
        <style>{'body { background-color: #F26219; }'}</style>
      </Helmet>
      <h2>You have been defeated</h2>
      <h3>correctChoice</h3>
      <p>Better luck next time</p>
      <p>Try studying more</p>
      <img src="https://i.imgur.com/JlXtPpf.png" alt="PepeHands"/>
    </div>
  );
}

export default Lost;