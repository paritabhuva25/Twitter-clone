import React, { Component } from 'react';
import './App.css';
import Navlogin from './navlogin';

class App1 extends Component {
  render() {
    return (
        <div className="App1">
          <Navlogin />
          {this.props.children}

      </div>
    );
  }
}

export default App1;
