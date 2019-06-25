import React from 'react';
import { Helmet } from 'react-helmet';
import WS from '../net';

class Lost extends React.Component {
  constructor(props) {
    super(props);

    this.state = { elimReason: '' };
  }

  componentDidMount() {
    WS.onEvent('reasonRes', (data) => {
      this.setState({
        elimReason: data.msg
      });
    });
    WS.send('reasonReq');
  }

  componentWillUnmount() {
    WS.remove('reasonRes');
  }

  render() {
    const victoryStyle = {
      position: 'absolute', 
      left: '50%', 
      top: '45%',
      transform: 'translate(-50%, -50%)'
    };
    return (
      <div className="App" style={victoryStyle}>
        <Helmet>
          <title>You Have Been Defeated</title>
          <style>{'body { background-color: #F26219; }'}</style>
        </Helmet>
        <h2>You have been defeated</h2>
        <h3>{this.state.elimReason}</h3>
        <p>Better luck next time</p>
        <p>Try studying more</p>
        <img src="https://i.imgur.com/JlXtPpf.png" alt="PepeHands"/>
      </div>
    );
  }
}

export default Lost;