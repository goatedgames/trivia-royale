import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet'
import UserList from './UserList';
import WS from '../../net';
import { Container, Row } from 'react-bootstrap';
import './Styles.css';

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

  componentWillUnmount() {
    WS.remove('lobbyUpd')
  }

  render() {
    return (
      <div className="App">
        <Helmet>
          <title>Trivia Royale</title>
          <style>{'body { background-color: #86BBD8; }'}</style>
        </Helmet>
        <h1 className="title">Players</h1>
        <button onClick={() => WS.send('startReq', {})}>start game</button>
        <div>
          <UserList usernames={this.state.usernames} />
        </div>
      </div>
    )
  }
}

export default Lobby;