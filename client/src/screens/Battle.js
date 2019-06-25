import React from 'react';
import {Helmet} from 'react-helmet';
import {Button, Container, Image} from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'

/* const color = {navy:'#33658A',sky:'#86BBD8',bean:'#758E4F',sunflower:'#F6AE2D',oranje:'#F26219'};
function Battle() {
  return (
    <div>
      <Helmet>
        <title>Battling...</title>
        <style>{'body { background-color: #F6AE2D; }'}</style>
      </Helmet>
      Bool
    </div>
  );
}

export default Battle; */
import WS from '../net';

class Battle extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      question: 'What is my best friend\'s name?',
      choices: ['bob the coolest man on the planet0', 'fred to coolest friend in the universe', 'joe the wise wizard', 'sally the realest girl in thw world joe the wise wizardjoe the wise wizardjoe the wise wizard'],
      imgURL: 'https://cdn.arstechnica.net/wp-content/uploads/2014/11/2014-11-26_00002.jpg'
    }
    this.createGrid = this.createGrid.bind(this);
  }

  /* componentDidMount() {
    WS.onEvent('newQ', (data) => {
      this.setState({
        question: data.q,
        choices: data.choices,
        imgURL: data.url
      });
    });
    WS.send('QReq', {});
  }
 */
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
    let buttonChoices = this.state.choices.map((choice, index) => {
      return <Button key={index} onClick={() => this.onClick(index)}>{choice}</Button>
    });
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
            <ul>
              <li>myName</li>
              <li>myLives</li>
            </ul>
          </nav>
          <article>
{/*               <Row>
                <Button variant="primary" size="lg"></Button>
                <Button variant="secondary" size="lg"></Button>
              </Row>
              <Row>
                <Button variant="success" size="lg"></Button>
                <Button variant="danger" size="lg"></Button>
              </Row> */}
              <Image src={this.state.imgURL} fluid />
              <Container>
                <Row>
                  <Col><Button variant="primary" key={0}>{this.state.choices[0]}</Button></Col>
                  <Col><Button variant="success" key={1}>{this.state.choices[1]}</Button></Col>
                </Row>
                <Row>
                  <Col><Button variant="success" key={2}>{this.state.choices[2]}</Button></Col>
                  <Col><Button variant="success" key={3}>{this.state.choices[3]}</Button></Col>
                </Row>
              </Container>
          </article>
          <nav>
            <ul>
              <li>enemyName</li>
              <li>enemyLives</li>
            </ul>
          </nav>
        </section>
        <footer>
          questionTime
        </footer>
      </div>
    );
  }
  createGrid(answers){
    let grid;
    let count = 0;
    for (let i = 0; i < Math.ceil(answers.length/2);i++){
      let rowBuilder = 
        (<Row>
          <Col>{answers[i+count]}</Col>
          <Col>{answers[i+count+1]}</Col>
        </Row>);
      count++;
      grid = grid + rowBuilder;
    }
    return (grid);
  }
}

export default Battle;
