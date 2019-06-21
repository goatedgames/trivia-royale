import React from 'react';

import {Splash, Lobby, Battle, Wait, Victory, Lost} from './screens/index';

import WS from './net';

const SCREENS = {
  SPLASH: 0,
  LOBBY: 1,
  BATTLE: 2,
  BLESSED: 3,
  LOST: 4,
  VICTORY: 5,
  WAIT: 6
}

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = { screen: SCREENS.SPLASH };

    this.onUsernameSubmit = this.onUsernameSubmit.bind(this);
  }

  componentDidMount() {
    WS.onEvent('screenChange', (data) => {
      this.setState({
        screen: data.screen
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
      case SCREENS.BATTLE:
        return <Battle />;
      case SCREENS.VICTORY:
        return <Victory />;
      case SCREENS.LOST:
        return <Lost />;
      case SCREENS.WAIT:
        return <Wait />;
      default:
        return <Wait />;
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