import React from 'react';

import {Splash, Lobby, Battle, Wait, Victory, Lost} from './screens/index';

import WS from './net';

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.onUsernameSubmit = this.onUsernameSubmit.bind(this);
  }

  componentDidMount() {
    WS.onEvent('uuid-res', (data) => {
      console.log('My id: ', data.id);
    });
  }

  onUsernameSubmit(username) {
    WS.send('user-join', { username: username });
  }

  render() {
    //return <Splash onEnter={this.onUsernameSubmit}/>;
    //return <Lobby />;
    return <Battle />;
    //return <Wait />;
    //return <Victory />;
    //return <Lost />;
  }
}

export default Game;