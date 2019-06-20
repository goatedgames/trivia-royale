import React from 'react';

import {Splash, Lobby, Battle, Wait, Victory, Lost} from './screens/index';

import WS from './net';

const SCREENS = {
  SPLASH: 0,
  LOBBY: 1
}

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = { screen: SCREENS.SPLASH };

    this.onUsernameSubmit = this.onUsernameSubmit.bind(this);
  }

  componentDidMount() {
    WS.onEvent('idRes', (data) => {
      this.setState({
        screen: SCREENS.LOBBY
      });
    });
  }

  onUsernameSubmit(username) {
    WS.send('userJoin', { username: username });
  }

  render() {
    switch (this.state.screen) {
      case SCREENS.SPLASH:
        return <Splash onEnter={this.onUsernameSubmit}/>;
      case SCREENS.LOBBY:
        return <Lobby />;
      default:
        return <Victory />;
    }

    //return <Splash onEnter={this.onUsernameSubmit}/>;
    // return <Lobby />;
    // return <Battle />;
    // return <Wait />;
    // return <Victory />;
    // return <Lost />;
  }
}

export default Game;