import React from 'react';
import PropTypes from 'prop-types';
import './Styles.css';
import { Helmet } from 'react-helmet';
import { InputGroup, FormControl, Button } from 'react-bootstrap';

class Splash extends React.Component {

  constructor(props) {
    super(props);
    this.state = { username: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({
      username: e.target.value
    });
  }

  handleSubmit(e) {
    console.log(this.state.username)
    this.props.onEnter(this.state.username);
    e.preventDefault();
  }

  render() {
    const positioning = {
      position: 'absolute',
      left: '50%',
      top: '45%',
      transform: 'translate(-50%, -50%)'
    };
    return (
      <div className="App" style={positioning}>
        <Helmet>
          <title>Trivia Royale</title>
          <style>{'body { background-color: #86BBD8; }'}</style>
        </Helmet>
        <h1 className="title">Trivia Royale</h1>
        <p className="enterDescription">What would you like to be called?</p>
        <InputGroup className="mb-3" value={this.state.username} onSubmit={this.handleSubmit}>
          <FormControl
            placeholder="Username"
            aria-label="Recipient's username"
            aria-describedby="basic-addon2"
            value={this.state.username}
            onChange={this.handleChange}
          />
          <InputGroup.Append>
            <Button className="txtInput" variant="secondary" onClick={this.handleSubmit}>Enter</Button>
          </InputGroup.Append>
        </InputGroup>
      </div>
    );
  }
}

Splash.propTypes = {
  onEnter: PropTypes.func
};

export default Splash;