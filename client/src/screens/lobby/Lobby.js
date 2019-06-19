import React from 'react';
import PropTypes from 'prop-types';

import UserList from './UserList';

class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.state = { usernames: ['iTz So Tami', 'RogueStudent337'] };
  }

  render() {
    return (
      <div>
        <h1 className="App">Players</h1>
        <UserList usernames={this.state.usernames}/>
      </div>
    )
  }
}

export default Lobby;