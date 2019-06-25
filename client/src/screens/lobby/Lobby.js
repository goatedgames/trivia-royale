import React from 'react';
import PropTypes from 'prop-types';
import {Helmet} from 'react-helmet'
import UserList from './UserList';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import './Styles.css';

class Lobby extends React.Component {
  constructor(props) {
    super(props);
    this.state = { usernames: ['iTz So Tami', 'RogueStudent337','iTz So Tami', 'RogueStudent337','iTz So Tami', 'RogueStudent337dddddddd','iTz So Tami', 'RogueStudent337','RogueStudent337dddddddd','RogueStudent337dddddddd','RogueStudent337dddddddd'] };
  }

  render() {
    const positioning = {
      position: 'absolute',
      left: '50%',
      top: '45%',
      transform: 'translate(-50%, -50%)'
    }
    return (
      <div className="App">
        <Helmet>
          <title>Trivia Royale</title>
          <style>{'body { background-color: #86BBD8; }'}</style>
        </Helmet>
        <h1 className="title">Players</h1>
        <div>
          <UserList usernames={this.state.usernames}/>
        </div>
      </div>
    )
  }
}

export default Lobby;