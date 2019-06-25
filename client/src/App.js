import React from 'react';
import logo from './logo.svg';
import './App.css';

import Game from './Game'

import WS from './net';

const host = window.location.origin.replace(/^http/, 'ws')
// WS.init('ws://localhost:8080');
WS.init(host)

function App() {
  return <Game />;
  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.js</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>
  //   </div>
  // );
}

export default App;
