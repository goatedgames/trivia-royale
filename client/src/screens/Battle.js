import React from 'react';
import { Helmet } from 'react-helmet';
import { Button, Container, Image, Row, Col } from 'react-bootstrap';
import WS from '../net';

class Battle extends React.Component {
  constructor(props) {
    super(props);

    this.timer = 0;

    this.state = {
      question: '',
      choices: ['bob', 'fred', 'joe', 'sally'],
      imgURL: '',
      timeLeft: 5,
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
        imgURL: data.url,
        timeLeft: data.timeLimit
      });
      console.log(data.timeLeft);

      // Could desync if request takes >1 seconds
      this.timer = setInterval(() => this.countdown(), 1000);
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

  componentWillUnmount() {
    WS.remove('newQ');
    WS.remove('matchRes');
    if (this.timer !== 0) {
      clearInterval(this.timer);
    }
  }

  onClick(index) {
    WS.send('ans', { i: index });
  }

  render() {
    const positioning = {
      position: 'absolute',
      left: '50%',
      top: '45%',
      transform: 'translate(-50%, -50%)'
    };
    return (
      <div style={positioning}>
        <Helmet>
          <title>Battling...</title>
          <style>{'body { background-color: #F6AE2D; }'}</style>
        </Helmet>
        <header>
          <h1>{this.state.question}</h1>
        </header>
        <section>
          <nav>
            {this.state.myName}: {this.state.myLives} lives
          </nav>
          <article>
            <Image src={this.state.imgURL} fluid />
            <Container>
              <Row>
                <Col><Button variant="primary" key={0} onClick={() => this.onClick(0)}>{this.state.choices[0]}</Button></Col>
                <Col><Button variant="success" key={1} onClick={() => this.onClick(1)}>{this.state.choices[1]}</Button></Col>
              </Row>
              <Row>
                <Col><Button variant="warning" key={2} onClick={() => this.onClick(2)}>{this.state.choices[2]}</Button></Col>
                <Col><Button variant="danger" key={3} onClick={() => this.onClick(3)}>{this.state.choices[3]}</Button></Col>
              </Row>
            </Container>
          </article>
          <nav>
            {this.state.oppoName}: {this.state.oppoLives} lives
          </nav>
        </section>
        <footer>
          {this.state.timeLeft}
        </footer>
      </div>
    );
  }
}

export default Battle;