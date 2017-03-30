import React, { Component } from 'react';
import './App.css';
import NevigationBar from './NevigationBar.js'
//import Register from './Register.js'

class App extends Component {
  render() {
    return (
        <div className="App">
          <NevigationBar {...this.props}/>
          {this.props.children}
        </div>
    );
  }
}

export default App;
