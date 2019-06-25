import React from 'react';
import { Helmet } from 'react-helmet';
import WS from '../net';

class Wait extends React.Component {
  constructor(props) {
    super(props);

    this.timer = 0;

    this.state = { 
      reason: '',
      timeLeft: 5
    };
  }

  componentDidMount() {
    WS.onEvent('reasonRes', (data) => {
      this.setState({
        reason: data.msg
      });
    });
    WS.send('reasonReq');

    if (this.timer === 0 && this.state.timeLeft > 0) {
      this.timer = setInterval(() => this.countdown(), 1000);
    }
  }

  componentWillUnmount() {
    WS.remove('reasonRes');
  }

  countdown() {
    const newTime = this.state.timeLeft - 1;
    this.setState({
      timeLeft: newTime
    });

    if (newTime === 0) {
      clearInterval(this.timer);
      this.timer = 0;
    }
  }

  render() {
    return (
      <div className="App">
        <Helmet>
          <title>Rest Up, Warrior</title>
          <style>{'body { background-color: #86BBD8; }'}</style>
        </Helmet>
        <h1>{this.state.timeLeft}</h1>
        <h2>{this.state.reason}</h2>
        <p>Prepare for your next endeavor</p>
        <img src="https://i.kym-cdn.com/photos/images/original/001/248/330/675.jpg" alt="ResidentSleep"/>
      </div>
    );
  }
}

export default Wait;