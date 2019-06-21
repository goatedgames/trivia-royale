import React from 'react';

import WS from '../net';

class Battle extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      question: '',
      choices: ['bob', 'fred', 'joe', 'sally'],
      imgURL: ''
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
    WS.send('QReq', {});
  }

  onClick(index) {
    WS.send('ans', { i: index });
  }

  render() {
    return (
      <div>
        <h2>myName</h2>
        <h2>enemyName</h2>
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