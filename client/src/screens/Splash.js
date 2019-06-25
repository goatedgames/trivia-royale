import React from 'react';
import PropTypes from 'prop-types';
import './Styles.css'
import {Helmet} from 'react-helmet';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

const color = {navy:'#33658A',sky:'#86BBD8',bean:'#758E4F',sunflower:'#F6AE2D',oranje:'#F26219'};
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
        {/* <form onSubmit={this.handleSubmit}>
          <input
            className="txtInput"
            type="text"
            value={this.state.username}
            onChange={this.handleChange} />
          <input type="submit" value="Enter" />
        </form> */}
        <InputGroup className="mb-3" value={this.state.username} onSubmit={this.handleSubmit}>
          <FormControl
            placeholder="Username"
            aria-label="Recipient's username"
            aria-describedby="basic-addon2"
          />
          <InputGroup.Append>
            <Button className="txtInput" variant="secondary">Enter</Button>
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