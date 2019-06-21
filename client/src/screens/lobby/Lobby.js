import React from 'react';
import PropTypes from 'prop-types';

import UserList from './UserList';
import WS from '../../net';

class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.state = { usernames: [] };
  }

  componentDidMount() {
    WS.onEvent('lobbyUpd', (data) => {
      this.setState({
        usernames: data.usernames
      });
    });
    WS.send('lobbyReq', {});
  }

  render() {
    return (
      <div>
        <button onClick={() => WS.send('game-start-req', {})}>start game</button>
        <h1 className="App">Players</h1>
        <UserList usernames={this.state.usernames}/>
      </div>
    )
  }
}

export default Lobby;