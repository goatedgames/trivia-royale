import React from 'react';
import { Helmet } from 'react-helmet';
import WS from '../net';

class Wait extends React.Component {
  constructor(props) {
    super(props);

    this.state = { reason: '' };
  }

  componentDidMount() {
    WS.onEvent('reasonRes', (data) => {
      this.setState({
        reason: data.msg
      });
    });
    WS.send('reasonReq');
  }

  componentWillUnmount() {
    WS.remove('reasonRes');
  }

  render() {
    return (
      <div className="App">
        <Helmet>
          <title>Rest Up, Warrior</title>
          <style>{'body { background-color: #86BBD8; }'}</style>
        </Helmet>
        <h1>timeLeft</h1>
        <h2>{this.state.reason}</h2>
        <p>Prepare for your next endeavor</p>
        <img src="https://i.kym-cdn.com/photos/images/original/001/248/330/675.jpg" alt="ResidentSleep"/>
      </div>
    );
  }
}

export default Wait;