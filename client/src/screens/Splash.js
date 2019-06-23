import React from 'react';
import PropTypes from 'prop-types';
import {Helmet} from 'react-helmet';

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
    return (
      <div className="App">
        <Helmet>
          <title>Trivia Royale</title>
          <style>{'body { background-color: #86BBD8; }'}</style>
        </Helmet>
        <h1>Trivia Royale</h1>
        <p>What would you like to be called?</p>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            value={this.state.username}
            onChange={this.handleChange} />
          <input type="submit" value="Enter" />
        </form>
      </div>
    );
  }
}

Splash.propTypes = {
  onEnter: PropTypes.func
};

export default Splash;