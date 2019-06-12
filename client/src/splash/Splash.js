import React from 'react';
import '../App.css'

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
    this.props.onSubmit(this.state.username);
    e.preventDefault();
  }

  render() {
    return (
      <div className="App">
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

export default Splash;