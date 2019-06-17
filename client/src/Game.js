import React from 'react';

import {Splash, Lobby, Battle, Wait, Victory, Lost} from './screens/index';

const wsURL = 'ws://localhost:8080';

class Game extends React.Component {
  ws = new WebSocket(wsURL);
  
  constructor(props) {
    super(props);

    this.onUsernameSubmit = this.onUsernameSubmit.bind(this);
  }

  componentDidMount() {
    this.ws.onopen = () => {
      console.log('Opened WebSocket');
    }

    this.ws.onclose = () => {
      console.log('Closed WebSocket');
    }
  }

  onUsernameSubmit(username) {
    const payload = {
      eventName: 'user-join',
      username: username
    };
    this.ws.send(JSON.stringify(payload));
  }

  render() {
    return <Splash onEnter={this.onUsernameSubmit}/>;
    // return <Lobby />;
    // return <Battle />;
    // return <Wait />;
    // return <Victory />;
    // return <Lost />;
  }
}

export default Game;