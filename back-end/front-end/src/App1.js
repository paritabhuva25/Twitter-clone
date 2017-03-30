import React, { Component } from 'react';
import './App.css';
import Navlogin from './navlogin.js'
//import Register from './Register.js'

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
