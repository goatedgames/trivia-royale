import React from 'react';

import WS from '../net';

class Battle extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      question: '',
      choices: ['bob', 'fred', 'joe', 'sally'],
      imgURL: '',
      myName: '',
      myLives: 0,
      oppoName: '',
      oppoLives: 0
    }
  }

  componentDidMount() {
    WS.onEvent('newQ', (data) => {
      this.setState({
        question: data.q,
        choices: data.choices,
        imgURL: data.url
      });
    });
    WS.onEvent('matchRes', (data) => {
      this.setState({
        myName: data.myName,
        myLives: data.myLives,
        oppoName: data.oppoName,
        oppoLives: data.oppoLives
      });
    });
    WS.send('QReq', {});
    WS.send('matchReq', {});
  }

  componentWillUnmount() {
    WS.remove('newQ');
    WS.remove('matchRes');
  }

  onClick(index) {
    WS.send('ans', { i: index });
  }

  render() {
    return (
      <div>
        <h2>{this.state.myName}: {this.state.myLives} lives</h2>
        <h2>{this.state.oppoName}: {this.state.oppoLives} lives</h2>
        <h1>{this.state.question}</h1>
        <h2>questionTime</h2>
        <img src={this.state.imgURL} />
        {this.state.choices.map((choice, index) => {
          return <button key={index} onClick={() => this.onClick(index)}>{choice}</button>
        })}
      </div>
    );
  }
}

export default Battle;